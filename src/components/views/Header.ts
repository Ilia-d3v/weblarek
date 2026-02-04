import { Component } from "../base/Component";

type HeaderHandlers = {
  onBasketClick: () => void;
};

type HeaderData = {
  counter: number;
};

export class Header extends Component<HeaderData> {
  private counterEl: HTMLElement;
  private basketBtn: HTMLButtonElement;

  constructor(container: HTMLElement, handlers: HeaderHandlers) {
    super(container);

    this.counterEl = container.querySelector(".header__basket-counter")!;
    this.basketBtn = container.querySelector(".header__basket")!;

    this.basketBtn.addEventListener("click", handlers.onBasketClick);
  }

  set counter(value: number) {
    this.counterEl.textContent = String(value);
  }
}
