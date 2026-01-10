import type { IProduct } from '../../types';

export class Basket {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(product: IProduct): void {
    if (this.has(product.id)) return;
    this.items.push(product);
  }  

  remove(product: IProduct): void {
    this.items = this.items.filter((p) => p.id !== product.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some((p) => p.id === id);
  }
}
