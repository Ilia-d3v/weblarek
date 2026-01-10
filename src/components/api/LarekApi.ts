import type { IApi, IOrderRequest, IProduct, IProductsResponse } from '../../types';

export class LarekApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductsResponse>('/product/');
    return data.items;
  }

  async createOrder(order: IOrderRequest): Promise<unknown> {
    return this.api.post('/order/', order);
  }
}
