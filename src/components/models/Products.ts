import type { IProduct } from '../../types';

export class Products {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getById(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  setPreview(product: IProduct | null): void {
    this.preview = product;
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
