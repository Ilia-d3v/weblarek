import { Component } from "../base/Component";
import type { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

type CardCatalogHandlers = {
  onSelect: () => void;
};

export class CardCatalog extends Component<IProduct> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private priceEl: HTMLElement;

  private rootClickEl: HTMLElement;

  constructor(container: HTMLElement, handlers: CardCatalogHandlers) {
    super(container);

    this.titleEl = container.querySelector(".card__title")!;
    this.imageEl = container.querySelector(".card__image")!;
    this.categoryEl = container.querySelector(".card__category")!;
    this.priceEl = container.querySelector(".card__price")!;

    this.rootClickEl = container;

    this.rootClickEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
    
      if (target.closest(".card__button")) return;
    
      handlers.onSelect();
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

  set price(v: number | null) {
    this.priceEl.textContent = v === null ? "Недоступно" : `${v} синапсов`;
  }
}
