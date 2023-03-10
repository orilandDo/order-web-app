import { Component, OnInit } from '@angular/core';
import { Cities, MSG_STATUS, STATUS, Transports } from '../../constants/const-data';
import { Order, ProductItem } from '../../models/order';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Helper } from '../../helpers/helper';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryData } from '../../mock-data/delivery-data';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.scss']
})
export class OrderAddComponent implements OnInit {
  header: string = 'Thêm mới đơn hàng';
  matcher = new MyErrorStateMatcher();

  cities: any[] = Cities;
  deliveries: any[] = [];
  productList: any[] = [];
  transport: any[] = Transports;
  status: any[] = STATUS;
  agencyList: any[] = [];

  error: any = '';
  error1: any = '';
  isAdmin: boolean = new Helper().isAdmin();

  selectedStatus: any = { value: 1, label: '' };
  pickupSelected: any = null;
  deliverySelected: any = null;
  transportSelected: any = null;
  agencySelected: any = null;

  order: Order = {
    id: 0,
    createdDate: moment().format('DD/MM/YYYY'),
    deliveryId: 0,
    pickupId: 0,
    productTotal: 0,
    driver: '',
    note: '',
    transport: 0,
    licensePlates: '',
    receivedDate: '',
    status: 0,
    contract: '',
    products: [],
    agencyId: 0,
    agencyName: ''
  };

  date = new FormControl(new Date());
  helper = new Helper();

  constructor(public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.agencyList = this.helper.getAgencyList();
    this.productList = this.helper.getProductList();
    this.deliveries = this.helper.getDeliveryList();
    this.setProductOrder();
  }

  setProductOrder() {
    const list: ProductItem[] = [];
    this.productList.forEach(element => {
      const item = {
        id: element.id,
        name: element.name,
        quantity: 0,
      };
      list.push(item);
    });
    this.order.products = list;
  }

  onSubmit() {
    if (this.onValidationForm()) {
      this.order.status = Number(this.selectedStatus.value);
      this.order.deliveryId = Number(this.deliverySelected.id);
      this.order.pickupId = Number(this.pickupSelected.id);
      this.order.transport = Number(this.transportSelected.id);
      this.order.receivedDate = moment(this.date.value).format('DD/MM/YYYY');
      this.order.agencyId = this.agencySelected !== null ? this.agencySelected.id : 0;
      this.order.products = this.order.products.filter(x => x.quantity !== 0);
      console.log(this.order)
      this.orderService.create(this.order).subscribe((response: any) => {
        console.log(response)
        if (response) {
          this.order.id = response.id;
          this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.ADD_ORDER', MSG_STATUS.SUCCESS));
          this.helper.addOrder(this.order);
          this.router.navigate(['orders/list']);
        } else {
          this.helper.showError(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.ADD_ORDER', MSG_STATUS.FAIL));
        }
      });
    }

  }

  onCancel() {
    this.router.navigate(['orders/list']);
  }

  focusOut() {
    this.order.productTotal = 0;
    this.order.products.forEach(element => {
      this.order.productTotal += element.quantity;
    });
  }

  onValidationForm(): boolean {
    let isValidForm: boolean = true;
    if (this.order.contract.length === 0
      || !this.agencySelected
      || !this.deliverySelected
      || !this.pickupSelected
      || !this.transportSelected
      || this.order.licensePlates.length === 0
      || this.order.driver.length === 0) {
      isValidForm = false;
      this.error = 'Vui lòng nhập đầy đủ thông tin bắt buộc (*)';
    } 
    if (this.order.productTotal === 0) {
      isValidForm = false;
      this.error1 = 'Vui lòng nhập số lượng sản phẩm';
    } else {
      this.error = '';
      isValidForm = true;
    }
    return isValidForm;
  }

}
