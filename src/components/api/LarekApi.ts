import type { IApi, IOrderRequest, IProduct, IProductsResponse } from '../../types';
import { API_URL } from '../../utils/constants';

export class LarekApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductsResponse>(`${API_URL}/product`);
    return data.items;
  }

  async createOrder(order: IOrderRequest): Promise<unknown> {
    return this.api.post(`${API_URL}/order`, order);
  }
}
