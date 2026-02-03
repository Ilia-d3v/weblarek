import { Component } from './base/Component';
import type { IEvents } from './base/Events';

type CardBasketData = {
  id: string;
  index: number;
  title: string;
  price: number | null;
};

export class CardBasket extends Component<CardBasketData> {
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  private id!: string;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.indexEl = container.querySelector('.basket__item-index')!;
    this.titleEl = container.querySelector('.card__title')!;
    this.priceEl = container.querySelector('.card__price')!;
    this.deleteBtn = container.querySelector('.basket__item-delete')!;

    this.deleteBtn.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }

  set index(v: number) {
    this.indexEl.textContent = String(v);
  }

  set title(v: string) {
    this.titleEl.textContent = v;
  }

  set price(v: number | null) {
    this.priceEl.textContent = v === null ? 'Недоступно' : `${v} синапсов`;
  }

  render(data: Partial<CardBasketData>): HTMLElement {
    if (data.id) this.id = data.id;
    return super.render(data);
  }
}
