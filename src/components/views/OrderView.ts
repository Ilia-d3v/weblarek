import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import type { IBuyer, TPayment } from "../../types";

export class OrderView extends Component<IBuyer> {
  private buttonsWrap: HTMLElement;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  private paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, private events: IEvents) {
    super(container);

    this.buttonsWrap = container.querySelector(".order__buttons")!;
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.submitBtn = container.querySelector('button[type="submit"]')!;
    this.errorsEl = container.querySelector(".form__errors")!;

    this.paymentButtons = Array.from(
      this.buttonsWrap.querySelectorAll("button[name]")
    );

    this.buttonsWrap.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLButtonElement)) return;

      const payment = target.name as TPayment;
      this.events.emit<Partial<IBuyer>>("buyer:change", { payment });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit<Partial<IBuyer>>("buyer:change", {
        address: this.addressInput.value,
      });
    });

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  private setPaymentActive(payment: TPayment | null) {
    this.paymentButtons.forEach((b) => b.classList.remove("button_alt-active"));
    if (!payment) return;

    const btn = this.paymentButtons.find((b) => b.name === payment);
    if (btn) btn.classList.add("button_alt-active");
  }

  set payment(v: TPayment | null) {
    this.setPaymentActive(v);
  }

  set address(v: string) {
    this.addressInput.value = v ?? "";
  }

  set valid(value: boolean) {
    this.submitBtn.disabled = !value;
  }

  set errors(message: string) {
    this.errorsEl.textContent = message;
  }

  render(data: Partial<IBuyer>): HTMLElement {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    return this.container;
  }
}
