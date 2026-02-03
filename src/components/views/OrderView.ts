import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBuyer, TPayment } from '../../types';

type OrderChange = Partial<Pick<IBuyer, 'payment' | 'address'>>;
type OrderErrors = Partial<Record<keyof Pick<IBuyer, 'payment' | 'address'>, string>> & {
  form?: string;
};

export class OrderView extends Component<IBuyer> {
  private buttonsWrap: HTMLElement;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  private paymentButtons: HTMLButtonElement[];

  private currentPayment: TPayment | null = null;

  constructor(container: HTMLFormElement, private events: IEvents) {
    super(container);

    this.buttonsWrap = container.querySelector('.order__buttons')!;
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.submitBtn = container.querySelector('button[type="submit"]')!;
    this.errorsEl = container.querySelector('.form__errors')!;

    this.paymentButtons = Array.from(this.buttonsWrap.querySelectorAll('button[name]'));

    this.buttonsWrap.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLButtonElement)) return;

      const payment = target.name as TPayment;
      this.currentPayment = payment;
      this.setPaymentActive(payment);

      this.events.emit<OrderChange>('order:change', { payment });

      this.setErrors({});
      this.validate();
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit<OrderChange>('order:change', { address: this.addressInput.value });

      this.setErrors({});
      this.validate();
    });

    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });

    this.validate();
  }

  private setPaymentActive(payment: TPayment) {
    this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
    const btn = this.paymentButtons.find((b) => b.name === payment);
    if (btn) btn.classList.add('button_alt-active');
  }

  private validate() {
    const hasPayment = Boolean(this.currentPayment);
    const hasAddress = Boolean(this.addressInput.value.trim());

    this.submitBtn.disabled = !(hasPayment && hasAddress);
  }

  set payment(v: TPayment | null) {
    this.currentPayment = v;
    if (v) this.setPaymentActive(v);
    this.validate();
  }

  set address(v: string) {
    this.addressInput.value = v ?? '';
    this.validate();
  }

  setErrors(errors: OrderErrors) {
    const msg = Object.values(errors).filter(Boolean).join('. ');
    this.errorsEl.textContent = msg;

    if (!msg) {
      this.validate();
      return;
    }

    this.submitBtn.disabled = true;
  }

  render(data: Partial<IBuyer>): HTMLElement {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;

    this.validate();

    return this.container;
  }
}
