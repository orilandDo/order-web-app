import { CONFIG } from '../common/config';
import { Product } from '../models/product';
import { WebRequestService } from './web-request.service';

export class ProductService {
    readonly url: string = CONFIG.URL.PRODUCT;

    constructor(
        private webrequestService: WebRequestService,
    ) { }

    getProductList() {
        return this.webrequestService.get(this.url);
    }

    create(obj: Product) {
        const payload = {
            name: obj.name,
            quantity: obj.quantity,
            price: obj.price,
            note: obj.note
        };
        return this.webrequestService.post(this.url, payload);
    }

    update(obj: Product) {
        const payload = {
            id: obj.id,
            name: obj.name,
            quantity: obj.quantity,
            price: obj.price,
            note: obj.note
        };
        return this.webrequestService.put(this.url, payload);
    }

    delete(id: number) {
        return this.webrequestService.delete(this.url + `/${id}`);
    }
}