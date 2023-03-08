import { Router } from '@angular/router';
import { CONFIG } from '../common/config';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
    navigateComponent: string = 'dashboard';
    isSuccess: boolean = false;
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
            //if (response && response.jwt) {
            if (response.code === 200) {
                // Lưu session vào storage
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.JWT, response.data.jwt ? response.data.jwt : '1');
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.LOGIN_INFO, JSON.stringify(response.data.loginInfo));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.MENU_LIST, JSON.stringify(response.data.menuList));
                sessionStorage.setItem(CONFIG.SESSION_STORAGE.USER_LIST, JSON.stringify(response.data.userList));
                this.isSuccess = true;
                this.errorSubject.next(null);
                this.router.navigateByUrl(this.navigateComponent);
            } else if (response.code === 401) {
                this.isSuccess = false;
                this.errorSubject.next('Tên đăng nhập hoặc mật khẩu không đúng.');
                this.errorSubject.next(response.Message);
            }
        });

        /*-------*/
        // // login thanh cong, lay danh sach menu tuong ung quyen account
        // const user = this.data.find(x => x.username === username && x.password === password);
        // if (user) {
        //     //if (username === 'admin' && password === '123aaa') {
        //     sessionStorage.setItem('jwt', '1');
        //     sessionStorage.setItem('loginInfo', user.isAdmin.toString());
        //     sessionStorage.setItem('orderList', JSON.stringify(ORDERS_DATA)); // co the bo

        //     let menu = [];
        //     if (user.isAdmin) {
        //         menu = MenuAdminData;
        //         sessionStorage.setItem('username', 'Administrator');
        //     } else {
        //         menu = MenuUserData;
        //         sessionStorage.setItem('username', 'Nha phan phoi');
        //     }
        //     sessionStorage.setItem('menuList', JSON.stringify(menu));
        //     this.errorSubject.next(null);
        //     this.router.navigateByUrl(this.navigateComponent);
        // } else {
        //     sessionStorage.setItem('jwt', '0');
        //     this.errorSubject.next('Username hoặc password không đúng.');
        // }
        /*----*/
    }

    isAuthenticated(): boolean {
        if (sessionStorage.getItem(CONFIG.SESSION_STORAGE.JWT)) {
            console.log(sessionStorage.getItem('jwt'))
            return true;
        } else {
            return false;
        }
    }
}