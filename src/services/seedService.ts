import type { Product, ProductCategory } from '../types';
import {
  BRINJAL_SEED_IMAGE,
  INITIAL_PRODUCTS,
  MARIGOLD_IMAGE_CREDIT,
  MARIGOLD_SEED_IMAGE,
} from '../data/products';

const LEGACY_STORAGE_KEY = 'ceylon_seeds_inventory';
const SYNC_DEVICE_ID_KEY = 'ceylon_seeds_sync_device_id';

const LEGACY_IMAGE_URLS: Record<string, string[]> = {
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

const normalizeLegacyInventory = (products: Product[]): Product[] =>
  products.map((product) => {
    const badUrls = LEGACY_IMAGE_URLS[product.id];
    if (!badUrls) return product;

    const replacement =
      product.id === 'prod-brinjal-thinnavely' ? BRINJAL_SEED_IMAGE : MARIGOLD_SEED_IMAGE;
    const isLegacyImage = (image: string) => badUrls.some((url) => image.startsWith(url));
    return {
      ...product,
      image: isLegacyImage(product.image) ? replacement : product.image,
      gallery: (product.gallery ?? []).map((image) => (isLegacyImage(image) ? replacement : image)),
      ...(product.id === 'prod-marigold-lanka-gold'
        ? { imageCredit: product.imageCredit ?? MARIGOLD_IMAGE_CREDIT }
        : {}),
    };
  });

class SeedService {
  private async request<T>(
    path: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(path, { ...options, headers });
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(result?.error ?? `Request failed with status ${response.status}.`);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  public getAll(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  public async search(
    query: string,
    category?: ProductCategory | 'All',
    sortBy?: 'price-asc' | 'price-desc' | 'popular' | 'newest',
    maxPrice?: number
  ): Promise<Product[]> {
    let list = await this.getAll();

    if (category && category !== 'All') {
      list = list.filter((product) => product.category === category);
    }

    if (query.trim()) {
      const normalizedQuery = query.toLowerCase().trim();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.variety.toLowerCase().includes(normalizedQuery) ||
          product.cropType.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
      );
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      list = list.filter((product) => product.price <= maxPrice);
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'popular':
      default:
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
        break;
    }

    return list;
  }

  public login(username: string, password: string): Promise<{ token: string }> {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  public async importLegacyInventory(token: string): Promise<boolean> {
    const savedInventory = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!savedInventory) return false;

    let products: Product[];
    try {
      const parsed: unknown = JSON.parse(savedInventory);
      if (!Array.isArray(parsed)) {
        throw new Error('The saved browser inventory is not a product list.');
      }
      const savedProducts = normalizeLegacyInventory(parsed as Product[]);
      const defaultProducts = new Map(INITIAL_PRODUCTS.map((product) => [product.id, product]));
      products = savedProducts.filter((product) => {
        const defaultProduct = defaultProducts.get(product.id);
        return !defaultProduct || JSON.stringify(product) !== JSON.stringify(defaultProduct);
      });
    } catch (error) {
      throw new Error(
        `Could not import the saved browser inventory: ${
          error instanceof Error ? error.message : 'invalid local data'
        }`
      );
    }

    let deviceId = localStorage.getItem(SYNC_DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(SYNC_DEVICE_ID_KEY, deviceId);
    }

    const result = await this.request<{ imported: boolean }>('/api/admin/import-legacy', {
      method: 'POST',
      body: JSON.stringify({ deviceId, products }),
    }, token);
    return result.imported;
  }

  public addProduct(product: Product, token: string): Promise<Product> {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }, token);
  }

  public updateProduct(product: Product, token: string): Promise<Product> {
    return this.request(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }, token);
  }

  public deleteProduct(id: string, token: string): Promise<void> {
    return this.request(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
  }

  public resetToDefaults(token: string): Promise<Product[]> {
    return this.request('/api/admin/catalog/reset', { method: 'POST' }, token);
  }

  public async uploadImage(file: File, token: string): Promise<string> {
    const body = new FormData();
    body.append('image', file);
    const result = await this.request<{ url: string }>('/api/admin/uploads', {
      method: 'POST',
      body,
    }, token);
    return result.url;
  }
}

export const seedService = new SeedService();
