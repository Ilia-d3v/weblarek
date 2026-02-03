import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';
import { categoryMap, CDN_URL  } from '../../utils/constants';

export class CardCatalog extends Component<IProduct> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private priceEl: HTMLElement;

  private id!: string;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.titleEl = container.querySelector('.card__title')!;
    this.imageEl = container.querySelector('.card__image')!;
    this.categoryEl = container.querySelector('.card__category')!;
    this.priceEl = container.querySelector('.card__price')!;

    container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set image(value: string) {
    const src = /^https?:\/\//.test(value) ? value : `${CDN_URL}/${value}`;
    this.setImage(this.imageEl, src);
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    this.categoryEl.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }

  set price(value: number | null) {
    this.priceEl.textContent =
      value === null ? 'Недоступно' : `${value} синапсов`;
  }

  render(data: Partial<IProduct>): HTMLElement {
    if (data.id) this.id = data.id;
    return super.render(data);
  }
}
