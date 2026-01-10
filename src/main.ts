import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { Api } from './components/base/Api';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { LarekApi } from './components/api/LarekApi';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

console.log('--- TEST: Products (data.ts) ---');
productsModel.setItems(apiProducts.items);
console.log('Каталог:', productsModel.getItems());

const firstId = apiProducts.items[0]?.id;
if (firstId) {
  console.log('getById:', productsModel.getById(firstId));
  productsModel.setPreview(apiProducts.items[0]);
  console.log('Preview:', productsModel.getPreview());
}

console.log('--- TEST: Basket ---');
const p0 = apiProducts.items[0];
const p1 = apiProducts.items[1];

if (p0) basketModel.add(p0);
if (p0) basketModel.add(p0); 
if (p1) basketModel.add(p1);

console.log('Корзина:', basketModel.getItems());
console.log('Count:', basketModel.getCount());
console.log('Total:', basketModel.getTotal());
if (p0) {
  console.log('has p0?', basketModel.has(p0.id));
  basketModel.remove(p0);
  console.log('После remove(p0):', basketModel.getItems());
}
basketModel.clear();
console.log('После clear:', basketModel.getItems());

console.log('--- TEST: Buyer ---');
console.log('Изначально:', buyerModel.getData(), 'errors:', buyerModel.validate());

buyerModel.setData({ payment: 'card', address: 'Москва, ул. Пушкина' });
console.log('Шаг1:', buyerModel.getData(), 'errors:', buyerModel.validateStep1());

buyerModel.setData({ email: 'test@test.ru', phone: '+79990000000' });
console.log('Шаг2:', buyerModel.getData(), 'errors:', buyerModel.validateStep2());

console.log('Полная validate:', buyerModel.validate());
buyerModel.clear();
console.log('После clear:', buyerModel.getData());

console.log('--- TEST: API getProducts ---');

const baseUrl = import.meta.env.VITE_API_ORIGIN;
const api = new Api(baseUrl);
const larekApi = new LarekApi(api);

larekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log('Каталог с сервера сохранён:', productsModel.getItems());
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога:', err);
  });
