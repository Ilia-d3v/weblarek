import type { IApi, IOrderRequest, IProduct, IProductsResponse, IOrderResponse} from '../../types';

export class LarekApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductsResponse>('/product/');
    return data.items;
  }

  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}
