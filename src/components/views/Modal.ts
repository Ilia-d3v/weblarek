import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Modal extends Component<unknown> {
  private contentEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.contentEl = container.querySelector('.modal__content')!;
    this.closeBtn = container.querySelector('.modal__close')!;

    this.closeBtn.addEventListener('click', () => this.close());
    container.addEventListener('click', (e) => {
      if (e.target === container) this.close(); 
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(content: HTMLElement) {
    this.contentEl.replaceChildren(content);
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentEl.replaceChildren();
    this.events.emit('modal:close');
  }
}
