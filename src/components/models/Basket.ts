import type { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(product: IProduct): void {
    if (this.has(product.id)) return;
    this.items.push(product);
    this.events.emit("basket:changed");
  }

  remove(product: IProduct): void {
    this.items = this.items.filter((p) => p.id !== product.id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
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
