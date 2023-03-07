import { CONFIG } from '../common/config';
import { WebRequestService } from './web-request.service';

export class NotificationService {
    readonly url: string = CONFIG.URL.NOTIFICATION;

    constructor(
        private webrequestService: WebRequestService,
    ) { }

    getNotificationList() {
        return this.webrequestService.get(this.url);
    }

    create(obj: any) {
        const payload = {

        };
        return this.webrequestService.post(this.url, payload);
    }

    delete(id: number) {
        return this.webrequestService.delete(this.url + `/${id}`);
    }
}