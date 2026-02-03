import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";

type BasketViewData = {
  items: HTMLElement[];
  total: number;
};

export class BasketView extends Component<BasketViewData> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.listEl = container.querySelector(".basket__list")!;
    this.totalEl = container.querySelector(".basket__price")!;
    this.orderBtn = container.querySelector(".basket__button")!;

    this.orderBtn.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(value: HTMLElement[]) {
    this.listEl.replaceChildren(...value);
    this.orderBtn.disabled = value.length === 0;
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }
}
