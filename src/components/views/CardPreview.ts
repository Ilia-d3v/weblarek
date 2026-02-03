import { Component } from "../base/Component";
import type { IProduct } from "../../types";
import type { IEvents } from "../base/Events";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardPreview extends Component<IProduct> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private textEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  private id!: string;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.titleEl = container.querySelector(".card__title")!;
    this.imageEl = container.querySelector(".card__image")!;
    this.categoryEl = container.querySelector(".card__category")!;
    this.textEl = container.querySelector(".card__text")!;
    this.priceEl = container.querySelector(".card__price")!;
    this.buttonEl = container.querySelector(".card__button")!;

    this.buttonEl.addEventListener("click", () => {
      this.events.emit("basket:add", { id: this.id });
    });
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
    this.priceEl.textContent = v === null ? "Недоступно" : `${v} синапсов`;
    this.buttonEl.disabled = v === null;
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;
    return super.render(data);
  }
}
