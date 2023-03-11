import { Router } from '@angular/router';
import { CONFIG } from '../common/config';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
    navigateComponent: string = 'dashboard';
    readonly url: string = CONFIG.URL.LOGIN;
    errorSubject: any = new BehaviorSubject<any>(null);
    errorMessage: any = this.errorSubject.asObservable();

    data = [
        { username: 'admin', password: '123aaa', isAdmin: 1 },
        { username: 'user1', password: '123aaa', isAdmin: 0 },
        { username: 'user2@gmail.com', password: '123456', isAdmin: 0 },
    ]

    constructor(
        private webrequestService: WebRequestService,
        private router: Router,
    ) { }

    login(username: string, password: string) {
        // Encrypt
        //var passwordEncrypt = CryptoJS.AES.encrypt(password, CONFIG.SECRET_KEY).toString();
        const payload = {
            username,
            password
        };

        this.webrequestService.post(this.url, payload).subscribe((response: any) => {
            if (response.code === 200) {
                // Lưu session vào storage
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.JWT, response.data.jwt ? response.data.jwt : '1');
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.LOGIN_INFO, JSON.stringify(response.data.loginInfo));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.MENU_LIST, JSON.stringify(response.data.menuList));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.USER_LIST, JSON.stringify(response.data.userList));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.DELIVERY_LIST, JSON.stringify(response.data.deliveryList));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.AGENCY_LIST, JSON.stringify(response.data.agencyList));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.PRODUCT_LIST, JSON.stringify(response.data.productList));
                this.errorSubject.next(null);
                this.router.navigateByUrl(this.navigateComponent);
            } else if (response.code === 401) {
                this.errorSubject.next('Tên đăng nhập hoặc mật khẩu không đúng.');
            }
        });
    }

    isAuthenticated(): boolean {
        if (sessionStorage.getItem(CONFIG.SESSION_STORAGE.JWT)) {
            return true;
        } else {
            return false;
        }
    }

    logOut() {
        sessionStorage.clear();
        this.router.navigate(['']);
    }
}