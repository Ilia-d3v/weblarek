import { Component } from "../base/Component";

export type CardBasketData = {
  index: number;
  title: string;
  price: number | null;
};

type CardBasketHandlers = {
  onDelete: () => void;
};

export class CardBasket extends Component<CardBasketData> {
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  constructor(container: HTMLElement, handlers: CardBasketHandlers) {
    super(container);

    this.indexEl = container.querySelector(".basket__item-index")!;
    this.titleEl = container.querySelector(".card__title")!;
    this.priceEl = container.querySelector(".card__price")!;
    this.deleteBtn = container.querySelector(".basket__item-delete")!;

    this.deleteBtn.addEventListener("click", handlers.onDelete);
  }

  set index(v: number) {
    this.indexEl.textContent = String(v);
  }

  set title(v: string) {
    this.titleEl.textContent = v;
  }

  set price(v: number | null) {
    this.priceEl.textContent = v === null ? "Недоступно" : `${v} синапсов`;
  }
}
