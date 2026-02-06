import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/api/LarekApi";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";

import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/CardCatalog";
import { Modal } from "./components/views/Modal";
import { CardPreview } from "./components/views/CardPreview";
import { BasketView } from "./components/views/BasketView";
import { OrderView } from "./components/views/OrderView";
import { ContactsView } from "./components/views/ContactsView";
import { SuccessView } from "./components/views/SuccessView";
import { Header } from "./components/views/Header";

import type { IOrderRequest, IProduct, IBuyer } from "./types";

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const galleryEl = document.querySelector(".gallery") as HTMLElement;
const modalEl = document.querySelector("#modal-container") as HTMLElement;
const headerEl = document.querySelector(".header") as HTMLElement;

const modal = new Modal(modalEl, events);
const gallery = new Gallery(galleryEl);
const header = new Header(headerEl, {
  onBasketClick: () => openBasket(),
});

const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketItemTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;

const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const orderEl = orderTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLFormElement;
const orderView = new OrderView(orderEl, events);

const contactsEl = contactsTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLFormElement;
const contactsView = new ContactsView(contactsEl, events);

const successEl = successTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLElement;
const successView = new SuccessView(successEl, events);

let activeModal: "order" | "contacts" | null = null;

let orderShowErrors = false;
let contactsShowErrors = false;

function errorsToString(errors: Record<string, string | undefined>) {
  return Object.values(errors).filter(Boolean).join(". ");
}

function isOrderEmpty(buyer: IBuyer) {
  return !buyer.payment && !buyer.address?.trim();
}

function isContactsEmpty(buyer: IBuyer) {
  return !buyer.email?.trim() && !buyer.phone?.trim();
}

function syncOrderForm(showErrors: boolean) {
  const data = buyerModel.getData();
  const stepErrors = buyerModel.validateStep1();

  orderView.render(data);

  const isValid = Object.keys(stepErrors).length === 0;
  orderView.valid = isValid;

  orderView.errors = showErrors ? errorsToString(stepErrors) : "";
}

function syncContactsForm(showErrors: boolean) {
  const data = buyerModel.getData();
  const stepErrors = buyerModel.validateStep2();

  contactsView.render(data);

  const isValid = Object.keys(stepErrors).length === 0;
  contactsView.valid = isValid;

  contactsView.errors = showErrors ? errorsToString(stepErrors) : "";
}

function syncActiveForm() {
  if (activeModal === "order") syncOrderForm(orderShowErrors);
  if (activeModal === "contacts") syncContactsForm(contactsShowErrors);
}

function openPreview(
  product: IProduct,
  buttonText: string,
  buttonDisabled: boolean,
) {
  const previewEl = cardPreviewTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

  const preview = new CardPreview(previewEl, {
    onToggleBasket: () => events.emit("basket:toggle", { id: product.id }),
  });

  const el = preview.render(product);
  preview.buttonText = buttonText;
  preview.buttonDisabled = buttonDisabled;

  modal.open(el);
}

function renderCatalog() {
  const items = productsModel.getItems().map((product) => {
    const cardEl = cardCatalogTemplate.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CardCatalog(cardEl, {
      onSelect: () => events.emit("card:select", { id: product.id }),
    });

    return card.render(product);
  });

  gallery.render({ items });
}

function buildBasketItem(product: IProduct, index: number): HTMLElement {
  const li = basketItemTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

  const indexEl = li.querySelector(".basket__item-index") as HTMLElement;
  const titleEl = li.querySelector(".card__title") as HTMLElement;
  const priceEl = li.querySelector(".card__price") as HTMLElement;
  const delBtn = li.querySelector(".basket__item-delete") as HTMLButtonElement;

  indexEl.textContent = String(index + 1);
  titleEl.textContent = product.title;
  priceEl.textContent =
    product.price === null ? "Бесценно" : `${product.price} синапсов`;

  delBtn.addEventListener("click", () => {
    events.emit("basket:remove", { id: product.id });
  });

  return li;
}

function openBasket() {
  const basketEl = basketTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;
  const itemElements = basketModel.getItems().map(buildBasketItem);

  const view = new BasketView(basketEl, {
    onOrder: () => events.emit("order:open"),
  });

  modal.open(
    view.render({
      items: itemElements,
      total: basketModel.getTotal(),
    }),
  );
}

function openOrder() {
  activeModal = "order";

  const buyer = buyerModel.getData();
  const showErrors = orderShowErrors || !isOrderEmpty(buyer);

  modal.open(orderView.render(buyer));
  syncOrderForm(showErrors);
}

function openContacts() {
  activeModal = "contacts";

  const buyer = buyerModel.getData();
  const showErrors = contactsShowErrors || !isContactsEmpty(buyer);

  modal.open(contactsView.render(buyer));
  syncContactsForm(showErrors);
}

function openSuccess(total: number) {
  activeModal = null;
  modal.open(successView.render({ total }));
}

events.on("catalog:changed", renderCatalog);

events.on<{ id: string }>("card:select", ({ id }) => {
  const product = productsModel.getById(id);
  if (!product) return;

  productsModel.setPreview(product);
});

events.on("preview:changed", () => {
  const product = productsModel.getPreview();
  if (!product) return;

  const inBasket = basketModel.has(product.id);

  const buttonDisabled = product.price === null;
  const buttonText = buttonDisabled
    ? "Нельзя купить"
    : inBasket
      ? "Удалить из корзины"
      : "В корзину";

  openPreview(product, buttonText, buttonDisabled);
});

events.on<Partial<IBuyer>>("buyer:change", (data) => {
  buyerModel.setData(data);
});

events.on("buyer:changed", () => {
  const buyer = buyerModel.getData();

  if (activeModal === "order") {
    if (!isOrderEmpty(buyer)) orderShowErrors = true;
  }

  if (activeModal === "contacts") {
    if (!isContactsEmpty(buyer)) contactsShowErrors = true;
  }

  syncActiveForm();
});

events.on<{ id: string }>("basket:toggle", ({ id }) => {
  const product = productsModel.getById(id);
  if (!product) return;

  if (basketModel.has(id)) basketModel.remove(product);
  else basketModel.add(product);

  productsModel.setPreview(product);
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getCount() });
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  const product = basketModel.getItems().find((p) => p.id === id);
  if (!product) return;

  basketModel.remove(product);
  openBasket();
});

events.on("order:open", openOrder);

events.on("order:submit", () => {
  orderShowErrors = true;

  const errors = buyerModel.validateStep1();
  if (Object.keys(errors).length) {
    syncOrderForm(true);
    return;
  }

  contactsShowErrors = false;
  openContacts();
});

events.on("contacts:submit", async () => {
  contactsShowErrors = true;

  const errors = buyerModel.validateStep2();
  if (Object.keys(errors).length) {
    syncContactsForm(true);
    return;
  }

  const buyer = buyerModel.getData();

  const order: IOrderRequest = {
    payment: buyer.payment!,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((p) => p.id),
  };

  try {
    await larekApi.createOrder(order);

    openSuccess(order.total);

    basketModel.clear();
    buyerModel.clear();

    orderShowErrors = false;
    contactsShowErrors = false;
  } catch (e) {
    console.error(e);
    contactsView.errors = "Ошибка оформления заказа";
    contactsView.valid = true;
  }
});

events.on("success:close", () => {
  modal.close();
  activeModal = null;
});

header.render({ counter: basketModel.getCount() });

larekApi
  .getProducts()
  .then((items) => productsModel.setItems(items))
  .catch((err) => console.error("Ошибка загрузки каталога:", err));
