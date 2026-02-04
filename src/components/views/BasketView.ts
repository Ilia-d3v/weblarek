import { Component } from "../base/Component";

type BasketViewHandlers = {
  onOrder: () => void;
};

type BasketViewData = {
  items: HTMLElement[];
  total: number;
};

export class BasketView extends Component<BasketViewData> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;
  private emptyEl: HTMLElement | null;

  constructor(container: HTMLElement, handlers: BasketViewHandlers) {
    super(container);

    this.listEl = container.querySelector(".basket__list")!;
    this.totalEl = container.querySelector(".basket__price")!;
    this.orderBtn = container.querySelector(".basket__button")!;
    this.emptyEl = container.querySelector(".basket__empty");

    this.orderBtn.addEventListener("click", () => {
      handlers.onOrder();
    });
  }

  set items(value: HTMLElement[]) {
    const isEmpty = value.length === 0;

    if (this.emptyEl) {
      this.emptyEl.hidden = !isEmpty;
    }

    if (isEmpty) {
      this.listEl.replaceChildren();
    } else {
      this.listEl.replaceChildren(...value);
    }

    this.orderBtn.disabled = isEmpty;
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }
}
