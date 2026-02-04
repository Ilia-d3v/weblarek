import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import type { IBuyer } from "../../types";

export class ContactsView extends Component<IBuyer> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  constructor(container: HTMLFormElement, private events: IEvents) {
    super(container);

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;
    this.submitBtn = container.querySelector('button[type="submit"]')!;
    this.errorsEl = container.querySelector(".form__errors")!;

    this.emailInput.addEventListener("input", () => {
      this.events.emit<Partial<IBuyer>>("buyer:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit<Partial<IBuyer>>("buyer:change", {
        phone: this.phoneInput.value,
      });
    });

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(v: string) {
    this.emailInput.value = v ?? "";
  }

  set phone(v: string) {
    this.phoneInput.value = v ?? "";
  }

  set valid(value: boolean) {
    this.submitBtn.disabled = !value;
  }

  set errors(message: string) {
    this.errorsEl.textContent = message;
  }

  render(data: Partial<IBuyer>): HTMLElement {
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    return this.container;
  }
}
