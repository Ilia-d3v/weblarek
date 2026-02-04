import { Component } from "../base/Component";
import type { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export type CardPreviewData = IProduct & { inBasket: boolean };

type CardPreviewHandlers = {
  onToggleBasket: () => void;
};

export class CardPreview extends Component<CardPreviewData> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private textEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  constructor(container: HTMLElement, handlers: CardPreviewHandlers) {
    super(container);

    this.titleEl = container.querySelector(".card__title")!;
    this.imageEl = container.querySelector(".card__image")!;
    this.categoryEl = container.querySelector(".card__category")!;
    this.textEl = container.querySelector(".card__text")!;
    this.priceEl = container.querySelector(".card__price")!;
    this.buttonEl = container.querySelector(".card__button")!;

    this.buttonEl.addEventListener("click", () => {
      if (this.buttonEl.disabled) return;
      handlers.onToggleBasket();
    });
  }

  private updateButton() {
    const hasPrice = this.buttonEl.dataset.hasPrice === "1";
    const inBasket = this.buttonEl.dataset.inBasket === "1";

    if (!hasPrice) {
      this.buttonEl.textContent = "Нельзя купить";
      this.buttonEl.disabled = true;
      return;
    }

    this.buttonEl.disabled = false;
    this.buttonEl.textContent = inBasket ? "Удалить из корзины" : "В корзину";
  }

  set title(v: string) {
    this.titleEl.textContent = v;
  }

  set image(v: string) {
    const src = /^https?:\/\//.test(v) ? v : `${CDN_URL}/${v}`;
    this.setImage(this.imageEl, src, this.titleEl.textContent ?? "");
  }

  set category(v: string) {
    this.categoryEl.textContent = v;
    this.categoryEl.className = `card__category ${
      categoryMap[v as keyof typeof categoryMap]
    }`;
  }

  set description(v: string) {
    this.textEl.textContent = v;
  }

  set price(v: number | null) {
    this.priceEl.textContent = v === null ? "Бесценно" : `${v} синапсов`;
    this.buttonEl.dataset.hasPrice = v === null ? "0" : "1";
    this.updateButton();
  }

  set inBasket(v: boolean) {
    this.buttonEl.dataset.inBasket = v ? "1" : "0";
    this.updateButton();
  }

  render(data: CardPreviewData): HTMLElement {
    this.price = data.price;
    this.inBasket = data.inBasket;

    return super.render(data);
  }
}
