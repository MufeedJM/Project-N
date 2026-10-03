import { Product, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'ceylon_seeds_inventory';

class SeedService {
  private getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read products from localStorage', e);
    }
    // Initialize default seed collection
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  private saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }

  public getAll(): Product[] {
    return this.getStoredProducts();
  }

  public getById(id: string): Product | undefined {
    return this.getStoredProducts().find((p) => p.id === id);
  }

  public getByCategory(category: ProductCategory): Product[] {
    return this.getStoredProducts().filter((p) => p.category === category);
  }

  public getFeatured(): Product[] {
    return this.getStoredProducts().filter((p) => p.featured);
  }

  public getBestSellers(): Product[] {
    return this.getStoredProducts().filter((p) => p.bestSeller);
  }

  public search(
    query: string,
    category?: ProductCategory | 'All',
    sortBy?: 'price-asc' | 'price-desc' | 'popular' | 'newest',
    maxPrice?: number
  ): Product[] {
    let list = this.getStoredProducts();

    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.variety.toLowerCase().includes(q) ||
          p.cropType.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'popular':
        default:
          list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
          break;
      }
    }

    return list;
  }

  // Admin extension methods - ready for full CRUD admin panel
  public addProduct(product: Product): Product {
    const list = this.getStoredProducts();
    const updated = [product, ...list];
    this.saveProducts(updated);
    return product;
  }

  public updateProduct(product: Product): Product {
    const list = this.getStoredProducts();
    const index = list.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      list[index] = product;
      this.saveProducts(list);
    }
    return product;
  }

  public deleteProduct(id: string): void {
    const list = this.getStoredProducts();
    const filtered = list.filter((p) => p.id !== id);
    this.saveProducts(filtered);
  }

  public resetToDefaults(): void {
    this.saveProducts(INITIAL_PRODUCTS);
  }
}

export const seedService = new SeedService();
