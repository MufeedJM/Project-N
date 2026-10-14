import { randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  BRINJAL_SEED_IMAGE,
  INITIAL_PRODUCTS,
  MARIGOLD_IMAGE_CREDIT,
  MARIGOLD_SEED_IMAGE,
} from '../src/data/products.js';
import type { Product } from '../src/types/index.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDirectory = path.join(projectRoot, 'server-data');
const uploadDirectory = path.join(dataDirectory, 'uploads');
const databasePath = path.join(dataDirectory, 'inventory.sqlite');
const port = Number(process.env.PORT || 3001);
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminUsername || !adminPassword) {
  throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local before starting the backend.');
}

mkdirSync(uploadDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

const productCount = database.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = database.prepare('INSERT INTO products (id, data) VALUES (?, ?)');
  database.exec('BEGIN');
  try {
    for (const product of INITIAL_PRODUCTS) {
      insertProduct.run(product.id, JSON.stringify(product));
    }
    database.exec("INSERT OR IGNORE INTO settings (key, value) VALUES ('legacy_inventory_imported', 'false')");
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadDirectory, { maxAge: '1d' }));

const sessions = new Map<string, number>();
const sessionLifetimeMs = 8 * 60 * 60 * 1000;

const legacyImageUrls: Record<string, string[]> = {
  'prod-brinjal-thinnavely': [
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733',
    'https://www.nationalgardens.in/296-large_default/indian-brinjal-seeds.jpg',
  ],
  'prod-marigold-lanka-gold': [
    'https://images.unsplash.com/photo-1588691500331-f1ceacb31fc6',
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed',
    'https://bhoolokaswargam.com/wp-content/uploads/2025/12/Untitled-design-81.webp',
  ],
};

const normalizeLegacyProductImage = (product: Product): Product => {
  const badUrls = legacyImageUrls[product.id];
  if (!badUrls) return product;

  const replacement =
    product.id === 'prod-brinjal-thinnavely' ? BRINJAL_SEED_IMAGE : MARIGOLD_SEED_IMAGE;
  const isLegacyImage = (image: string) => badUrls.some((url) => image.startsWith(url));
  const image = isLegacyImage(product.image) ? replacement : product.image;
  const gallery = (product.gallery ?? []).map((galleryImage) =>
    isLegacyImage(galleryImage) ? replacement : galleryImage
  );
  const hasLegacyImage =
    image !== product.image ||
    gallery.some((galleryImage, index) => galleryImage !== product.gallery?.[index]);

  if (!hasLegacyImage) return product;
  return {
    ...product,
    image,
    gallery,
    ...(product.id === 'prod-marigold-lanka-gold'
      ? { imageCredit: product.imageCredit ?? MARIGOLD_IMAGE_CREDIT }
      : {}),
  };
};

const passwordMatches = (provided: string, expected: string) => {
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
};

const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const expiresAt = sessions.get(token);

  if (!expiresAt || expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    response.status(401).json({ error: 'Admin sign-in is required. Please sign in again.' });
    return;
  }

  sessions.set(token, Date.now() + sessionLifetimeMs);
  next();
};

const readProducts = (): Product[] =>
  (database.prepare('SELECT data FROM products ORDER BY rowid').all() as { data: string }[]).map(
    ({ data }) => JSON.parse(data) as Product
  );

const saveProduct = (product: Product) => {
  database
    .prepare('INSERT INTO products (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data')
    .run(product.id, JSON.stringify(product));
};

for (const product of readProducts()) {
  const normalized = normalizeLegacyProductImage(product);
  if (normalized !== product) saveProduct(normalized);
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/admin/login', (request, response) => {
  const { username, password } = request.body as { username?: unknown; password?: unknown };
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !passwordMatches(username, adminUsername) ||
    !passwordMatches(password, adminPassword)
  ) {
    response.status(401).json({ error: 'Incorrect username or password.' });
    return;
  }

  const token = randomUUID();
  sessions.set(token, Date.now() + sessionLifetimeMs);
  response.json({ token });
});

app.post('/api/admin/import-legacy', requireAdmin, (request, response) => {
  const { deviceId } = request.body as { deviceId?: unknown };
  if (typeof deviceId !== 'string' || !/^[0-9a-f-]{36}$/i.test(deviceId)) {
    response.status(400).json({ error: 'A valid browser sync ID is required.' });
    return;
  }

  const importKey = `legacy_inventory_imported:${deviceId}`;
  const importedSetting = database
    .prepare('SELECT value FROM settings WHERE key = ?')
    .get(importKey) as { value: string } | undefined;

  if (importedSetting?.value === 'true') {
    response.json({ imported: false });
    return;
  }

  const legacyProducts = request.body?.products;
  if (
    !Array.isArray(legacyProducts) ||
    legacyProducts.some(
      (product) =>
        !product ||
        typeof product.id !== 'string' ||
        typeof product.name !== 'string' ||
        typeof product.image !== 'string' ||
        !Array.isArray(product.gallery)
    )
  ) {
    response.status(400).json({ error: 'The saved browser inventory is invalid and could not be imported.' });
    return;
  }

  const products = (legacyProducts as Product[]).map(normalizeLegacyProductImage);

  const upsertProduct = database.prepare(
    'INSERT INTO products (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data'
  );
  database.exec('BEGIN');
  try {
    for (const product of products) {
      upsertProduct.run(product.id, JSON.stringify(product));
    }
    database
      .prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .run(importKey, 'true');
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }

  response.json({ imported: true, count: products.length });
});

app.get('/api/products', (_request, response) => {
  response.json(readProducts());
});

app.post('/api/products', requireAdmin, (request, response) => {
  const product = request.body as Product;
  if (!product || typeof product.id !== 'string' || typeof product.image !== 'string') {
    response.status(400).json({ error: 'A valid product is required.' });
    return;
  }
  if (database.prepare('SELECT 1 FROM products WHERE id = ?').get(product.id)) {
    response.status(409).json({ error: 'A product with this ID already exists.' });
    return;
  }

  saveProduct(product);
  response.status(201).json(product);
});

app.put('/api/products/:id', requireAdmin, (request, response) => {
  const product = request.body as Product;
  if (!product || product.id !== request.params.id || typeof product.image !== 'string') {
    response.status(400).json({ error: 'A valid product matching the requested ID is required.' });
    return;
  }
  if (!database.prepare('SELECT 1 FROM products WHERE id = ?').get(product.id)) {
    response.status(404).json({ error: 'Product not found.' });
    return;
  }

  saveProduct(product);
  response.json(product);
});

app.delete('/api/products/:id', requireAdmin, (request, response) => {
  const productId = request.params.id;
  if (typeof productId !== 'string') {
    response.status(400).json({ error: 'A valid product ID is required.' });
    return;
  }
  const result = database.prepare('DELETE FROM products WHERE id = ?').run(productId);
  if (result.changes === 0) {
    response.status(404).json({ error: 'Product not found.' });
    return;
  }
  response.status(204).end();
});

app.post('/api/admin/catalog/reset', requireAdmin, (_request, response) => {
  const insertProduct = database.prepare('INSERT INTO products (id, data) VALUES (?, ?)');
  database.exec('BEGIN');
  try {
    database.exec('DELETE FROM products');
    for (const product of INITIAL_PRODUCTS) {
      insertProduct.run(product.id, JSON.stringify(product));
    }
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
  response.json(INITIAL_PRODUCTS);
});

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      callback(new Error('Choose a JPG, PNG, WebP, or GIF image (maximum 5 MB).'));
      return;
    }
    callback(null, true);
  },
});

app.post('/api/admin/uploads', requireAdmin, upload.single('image'), (request, response) => {
  if (!request.file) {
    response.status(400).json({ error: 'Choose an image to upload.' });
    return;
  }
  response.status(201).json({ url: `/uploads/${request.file.filename}` });
});

if (process.env.NODE_ENV === 'production') {
  const distDirectory = path.join(projectRoot, 'dist');
  if (!existsSync(distDirectory)) {
    throw new Error('Production build not found. Run npm run build before starting the server.');
  }
  app.use(express.static(distDirectory));
  app.get(/.*/, (_request, response) => response.sendFile(path.join(distDirectory, 'index.html')));
}

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('API request failed:', error);
  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  const status = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 500;
  response.status(status).json({ error: message });
});

const server = app.listen(port, () => {
  console.log(`Project N API listening on http://localhost:${port}`);
});

const closeServer = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
