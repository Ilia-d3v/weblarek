import type { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Products {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getById(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  setPreview(product: IProduct | null): void {
    this.preview = product;
    this.events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
