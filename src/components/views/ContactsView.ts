import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBuyer } from '../../types';

type ContactsChange = Partial<Pick<IBuyer, 'email' | 'phone'>>;
type ContactsErrors = Partial<Record<keyof Pick<IBuyer, 'email' | 'phone'>, string>> & {
  form?: string;
};

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
    this.errorsEl = container.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => {
      this.events.emit<ContactsChange>('contacts:change', { email: this.emailInput.value });

      this.setErrors({});
      this.validate();
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit<ContactsChange>('contacts:change', { phone: this.phoneInput.value });

      this.setErrors({});
      this.validate();
    });

    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit');
    });

    this.validate();
  }

  private validate() {
    const hasEmail = Boolean(this.emailInput.value.trim());
    const hasPhone = Boolean(this.phoneInput.value.trim());
    this.submitBtn.disabled = !(hasEmail && hasPhone);
  }

  set email(v: string) {
    this.emailInput.value = v ?? '';
    this.validate();
  }

  set phone(v: string) {
    this.phoneInput.value = v ?? '';
    this.validate();
  }

  setErrors(errors: ContactsErrors) {
    const msg = Object.values(errors).filter(Boolean).join('. ');
    this.errorsEl.textContent = msg;

    if (!msg) {
      this.validate();
      return;
    }

    this.submitBtn.disabled = true;
  }

  render(data: Partial<IBuyer>): HTMLElement {
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;

    this.validate();

    return this.container;
  }
}
