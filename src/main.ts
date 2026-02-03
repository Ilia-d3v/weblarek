import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';

import { Modal } from './components/views/Modal';
import { CardPreview } from './components/views/CardPreview';

import { BasketView } from './components/views/BasketView';
import { OrderView } from './components/views/OrderView';
import { ContactsView } from './components/views/ContactsView';
import { SuccessView } from './components/views/SuccessView';

import type { IOrderRequest, IProduct, TPayment } from './types';

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const galleryEl = document.querySelector('.gallery') as HTMLElement;
const basketCounterEl = document.querySelector('.header__basket-counter') as HTMLElement;
const basketButtonEl = document.querySelector('.header__basket') as HTMLButtonElement;

const modalEl = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalEl, events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

let orderView: OrderView | null = null;
let contactsView: ContactsView | null = null;

const gallery = new Gallery(galleryEl);

function renderCatalog() {
  const items = productsModel.getItems().map((product) => {
    const cardEl = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(cardEl, events);
    return card.render(product);
  });

  gallery.render({ items });
}

function buildBasketItem(product: IProduct, index: number): HTMLElement {
  const li = basketItemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const indexEl = li.querySelector('.basket__item-index') as HTMLElement;
  const titleEl = li.querySelector('.card__title') as HTMLElement;
  const priceEl = li.querySelector('.card__price') as HTMLElement;
  const delBtn = li.querySelector('.basket__item-delete') as HTMLButtonElement;

  indexEl.textContent = String(index + 1);
  titleEl.textContent = product.title;

  priceEl.textContent =
    product.price === null ? 'Недоступно' : `${product.price} синапсов`;

  delBtn.addEventListener('click', () => {
    events.emit('basket:remove', { id: product.id });
  });

  return li;
}

function openBasket() {
  const basketEl = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const itemElements = basketModel.getItems().map(buildBasketItem);
  const view = new BasketView(basketEl, events);

  modal.open(
    view.render({
      items: itemElements,
      total: basketModel.getTotal(),
    })
  );
}

function openOrder() {
  const orderEl = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  orderView = new OrderView(orderEl, events);
  contactsView = null;

  modal.open(orderView.render(buyerModel.getData()));
}

function openContacts() {
  const contactsEl = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  contactsView = new ContactsView(contactsEl, events);
  orderView = null;

  modal.open(contactsView.render(buyerModel.getData()));
}

function openSuccess(total: number) {
  const successEl = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const view = new SuccessView(successEl, events);
  modal.open(view.render({ total }));
}

events.on('catalog:changed', renderCatalog);

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = productsModel.getById(id);
  if (!product) return;

  productsModel.setPreview(product);

  const previewEl = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const preview = new CardPreview(previewEl, events);

  modal.open(preview.render(product));
});

events.on<{ id: string }>('basket:add', ({ id }) => {
  const product = productsModel.getById(id);
  if (!product) return;

  basketModel.add(product);
  modal.close();
});

events.on('basket:changed', () => {
  basketCounterEl.textContent = String(basketModel.getCount());
});

basketButtonEl.addEventListener('click', openBasket);

events.on<{ id: string }>('basket:remove', ({ id }) => {
  const product = basketModel.getItems().find((p) => p.id === id);
  if (!product) return;

  basketModel.remove(product);
  openBasket(); 
});

events.on('order:open', openOrder);

events.on<{ payment?: TPayment; address?: string }>('order:change', (data) => {
  buyerModel.setData(data);
});

events.on('order:submit', () => {
  const errors = buyerModel.validateStep1();
  if (Object.keys(errors).length) {
    orderView?.setErrors(errors as any);
    return;
  }
  openContacts();
});

events.on<{ email?: string; phone?: string }>('contacts:change', (data) => {
  buyerModel.setData(data);
});

events.on('contacts:submit', async () => {
  const errors = buyerModel.validateStep2();
  if (Object.keys(errors).length) {
    contactsView?.setErrors(errors as any);
    return;
  }

  const buyer = buyerModel.getData();

  if (!buyer.payment || !buyer.address || !buyer.email || !buyer.phone) {
    contactsView?.setErrors({ form: 'Заполните все поля' } as any);
    return;
  }

  const items = basketModel.getItems().map((p) => p.id);
  const total = basketModel.getTotal();

  const order: IOrderRequest = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    total,
    items,
  };

  try {
    await larekApi.createOrder(order);

    openSuccess(total);

    basketModel.clear();
    buyerModel.clear();

    orderView = null;
    contactsView = null;
  } catch (e) {
    console.error(e);
    contactsView?.setErrors({ form: 'Ошибка оформления заказа' } as any);
  }
});

events.on('success:close', () => {
  modal.close();
});

larekApi
  .getProducts()
  .then((items) => productsModel.setItems(items))
  .catch((err) => console.error('Ошибка загрузки каталога:', err));
