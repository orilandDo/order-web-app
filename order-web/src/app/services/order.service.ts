import { Injectable } from '@angular/core';
import { CONFIG } from '../common/config';
import { Helper } from '../helpers/helper';
import { Order } from '../models/order';
import { Search } from '../models/search';
import { WebRequestService } from './web-request.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
    readonly url: string = CONFIG.URL.ORDERS.ORDER;
    readonly url1: string = CONFIG.URL.ORDERS.SEARCH;
    readonly helper = new Helper();

    constructor(
        private webrequestService: WebRequestService,
    ) { }

    getOrderList() {
        
        return this.webrequestService.get(this.url + `/${this.helper.getUserId()}`);
    }

    search(obj: Search) {
        const payload = {
            id: obj.id,
            startDate: obj.start,
            endDate: obj.end,
            agencyId: obj.agencyId,
            productId: obj.productId,
            status: obj.status,
            userId: this.helper.getUserId(),
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
        const userId = this.helper.getUserId();
        if (userId !== 0) {
            payload.agencyId = userId;
        }
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
            isAdmin: this.helper.isAdmin(),
        };
        const userId = this.helper.getUserId();
        if (userId !== 0) {
            payload.agencyId = userId;
        }
        return this.webrequestService.put(this.url, payload);
    }

    updateStatus(obj: Order) {
        const payload = {
            id: obj.id,
            status: obj.status,
        }
        return this.webrequestService.put(this.url + '/status', payload);
    }

    delete(id: number) {
        return this.webrequestService.delete(this.url + `/${id}`);
    }
}