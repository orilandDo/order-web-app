import { CONFIG } from '../common/config';
import { Order } from '../models/order';
import { Search } from '../models/search';
import { WebRequestService } from './web-request.service';

export class OrderService {
    readonly url: string = CONFIG.URL.ORDERS.ORDER;
    readonly url1: string = CONFIG.URL.ORDERS.SEARCH;

    constructor(
        private webrequestService: WebRequestService,
    ) { }

    getOrderList() {
        return this.webrequestService.get(this.url);
    }

    search(obj: Search) {
        const payload = {
            id: obj.id,
            startDate: obj.start,
            endDate: obj.end,
            agencyId: obj.agencyId,
            productId: obj.productId,
            status: obj.status,
        };
        return this.webrequestService.post(this.url1, payload);
    }

    create(obj: Order) {
        const payload = {
            createdDate: obj.createdDate,
            deliveryId: obj.deliveryId,
            pickupId: obj.pickupId,
            productTotal: obj.productTotal,
            transport: obj.transport,
            licensePlates: obj.licensePlates,
            driver: obj.driver,
            note: obj.note,
            receivedDate: obj.receivedDate,
            status: obj.status,
            contract: obj.contract,
            agencyId: obj.agencyId,
            products: obj.products,
        };
        return this.webrequestService.post(this.url, payload);
    }

    update(obj: Order) {
        const payload = {
            id: obj.id,
            createdDate: obj.createdDate,
            deliveryId: obj.deliveryId,
            pickupId: obj.pickupId,
            productTotal: obj.productTotal,
            transport: obj.transport,
            licensePlates: obj.licensePlates,
            driver: obj.driver,
            note: obj.note,
            receivedDate: obj.receivedDate,
            status: obj.status,
            contract: obj.contract,
            agencyId: obj.agencyId,
            products: obj.products,
        };
        return this.webrequestService.put(this.url, payload);
    }

    updateStatus(obj: Order) {
        const payload = {
            id: obj.id,
            status: obj.status,
        }
        return this.webrequestService.put(this.url, payload);
    }

    delete(id: number) {
        return this.webrequestService.delete(this.url + `/${id}`);
    }
}