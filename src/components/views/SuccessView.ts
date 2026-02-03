import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";

type SuccessData = {
  total: number;
};

export class SuccessView extends Component<SuccessData> {
  private descriptionEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.descriptionEl = container.querySelector(
      ".order-success__description"
    )!;
    this.closeBtn = container.querySelector(".order-success__close")!;

    this.closeBtn.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }
}
