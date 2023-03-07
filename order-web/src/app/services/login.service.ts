import { Router } from '@angular/router';
import { ORDERS_DATA } from '../mock-data/orders-data';
import { MenuAdminData, MenuUserData } from '../mock-data/menu-data';
import { CONFIG } from '../common/config';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject } from 'rxjs';

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
        const payload = {
            username,
            password
        };

        // this.webrequestService.post(this.url, payload).subscribe((response: any) => {
        //     if (response && response.jwt) {
        //         // Lưu session vào storage
        //         sessionStorage.setItem('jwt', response.jwt);
        //         sessionStorage.setItem('loginInfo', JSON.stringify(response.loginInfo));
        //         sessionStorage.setItem('menuList', JSON.stringify(response.menu));
        //         this.isSuccess = true;
        //         this.errorSubject.next(null);
        //         this.router.navigateByUrl(this.navigateComponent);
        //     } else if (response.Message) {
        //         this.isSuccess = false;
        //         this.errorSubject.next('Tên đăng nhập hoặc mật khẩu không đúng.');
        //         this.errorSubject.next(response.Message);
        //     }
        // });

        // login thanh cong, lay danh sach menu tuong ung quyen account
        const user = this.data.find(x => x.username === username && x.password === password);
        if (user) {
            //if (username === 'admin' && password === '123aaa') {
            sessionStorage.setItem('jwt', '1');
            sessionStorage.setItem('loginInfo', user.isAdmin.toString());
            sessionStorage.setItem('orderList', JSON.stringify(ORDERS_DATA)); // co the bo

            let menu = [];
            if (user.isAdmin) {
                menu = MenuAdminData;
                sessionStorage.setItem('username', 'Administrator');
            } else {
                menu = MenuUserData;
                sessionStorage.setItem('username', 'Nha phan phoi');
            }
            sessionStorage.setItem('menuList', JSON.stringify(menu));
            this.errorSubject.next(null);
            this.router.navigateByUrl(this.navigateComponent);
        } else {
            sessionStorage.setItem('jwt', '0');
            this.errorSubject.next('Username hoặc password không đúng.');
        }
    }

    isAuthenticated(): boolean {
        if (sessionStorage.getItem('jwt')) {
            console.log(sessionStorage.getItem('jwt'))
            return true;
        } else {
            return false;
        }
    }

    setSession() {
        
    }
}