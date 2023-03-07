import { animate, style, transition, trigger, keyframes } from "@angular/animations";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { LoginInfo } from "../models/login-info";
import { Order } from "../models/order";

export interface INavbarData {
  routeLink: string;
  icon?: string;
  label: string,
  expanded?: boolean;
  items?: INavbarData[];
}

export interface ICity {
  value: number;
  label: string;
}

export interface ITransport {
  value: number;
  label: string;
}

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('350ms',
      style({ opacity: 1 })
    )
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('350ms',
      style({ opacity: 0 })
    )
  ])
])

export const rotate = trigger('rotate', [
  transition(':enter', [
    animate('1000ms',
      keyframes([
        style({ transform: 'rotate(0deg)', offset: '0' }),
        style({ transform: 'rotate(2turn)', offset: '1' })
      ])
    )
  ])
])

export class Helper {

  checkSession() {
    let appLoginId = document.getElementById('app-login');
    let appBodyId = document.getElementById('app-body');
    const session = sessionStorage.getItem('jwt');

    appLoginId ? appLoginId.hidden = false : '';
    appBodyId ? appBodyId.hidden = true : '';

    if (session && Number(session) === 1) {
      appLoginId ? appLoginId.hidden = true : '';
      appBodyId ? appBodyId.hidden = false : '';
    } else {
      appLoginId ? appLoginId.hidden = false : '';
      appBodyId ? appBodyId.hidden = true : '';
    }
  }

  clearSession() {
    sessionStorage.clear();
  }

  isAdmin(): boolean {
    const info = sessionStorage.getItem('loginInfo');
    if (info) {
      const json = JSON.parse(info) as LoginInfo;
      if (!json.isAdmin) {
        return false;
      }
    }
    return true;
  }

  getInfoName(): string {
    const info = sessionStorage.getItem('loginInfo');
    if (info) {
      const json = JSON.parse(info) as LoginInfo;
      return json.accountName;
    }
    return '';
  }

  getOrderList(): Order[] {
    let orderList: Order[] = [];
    let jsonString = sessionStorage.getItem('orderList');
    if (jsonString) {
      orderList = JSON.parse(jsonString) as Order[];
      orderList.forEach(item => {
        switch (item.status) {
          case 1:
            item.statusLabel = 'Đang chờ';
            break;
          case 2:
            item.statusLabel = 'Đang nhận';
            break;
          case 3:
            item.statusLabel = 'Đã nhận';
            break;
          case 4:
            item.statusLabel = 'hủy';
            break;
        }
      });
    }
    return orderList;
  }

  getMenuList(): INavbarData[] {
    let menuList: INavbarData[] = [];
    let jsonString = sessionStorage.getItem('menuList');
    if (jsonString) {
      menuList = JSON.parse(jsonString) as INavbarData[];
    }
    return menuList;
  }

  updateStatusOrder(id: number, status: number) {
    let orderList = this.getOrderList();
    if (orderList.length > 0) {
      orderList.forEach(element => {
        if (element.id === id) {
          element.status = status;
        }
      });
      sessionStorage.setItem('orderList', JSON.stringify(orderList));
    }
  }

  updateOrder(obj: any) {
    let orderList = this.getOrderList();
    if (orderList.length > 0) {
      orderList.forEach(element => {
        if (element.id === obj.id) {
          element = obj;
        }
      });
      sessionStorage.setItem('orderList', JSON.stringify(orderList));
    }
  }

  pushOrder(data: any) {
    debugger
    let orderList: Order[] = [];
    let jsonString = sessionStorage.getItem('orderList');
    if (jsonString) {
      orderList = JSON.parse(jsonString) as Order[];
      orderList.push(data);
      sessionStorage.setItem('orderList', JSON.stringify(orderList));
    }
  }

  getMessage(translate: TranslateService, key: string, status: number, content?: string): string {
    let msg: string = '';
    if (status === 1) {
      // Thành công
      translate.get(key).subscribe(x => {
        msg = x + " thành công";
      });
    } else {
      // Thất bại
      translate.get(key).subscribe(x => {
        msg = x + " xảy ra lỗi";
      });
    }
    return msg;
  }

  showSuccess(toastr: ToastrService, msg: string, title?: string) {
    toastr.success(msg);
  }

  showError(toastr: ToastrService, msg: string, title?: string) {
    toastr.error(msg);
  }
}

