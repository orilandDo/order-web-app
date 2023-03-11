import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cities, MSG_STATUS, STATUS, Transports } from '../../constants/const-data';
import { PRODUCT_DATA } from '../../mock-data/products-data';
import { Order, ProductItem } from '../../models/order';
import { MyErrorStateMatcher } from '../order-add/order-add.component';
import * as moment from 'moment';
import { Helper } from '../../helpers/helper';
import { DeliveryData } from '../../mock-data/delivery-data';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-dialog-detail-order',
  templateUrl: './dialog-detail-order.component.html',
  styleUrls: ['./dialog-detail-order.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DialogDetailOrderComponent implements OnInit {
  header: string = 'Thêm mới đơn hàng';
  matcher = new MyErrorStateMatcher();
  receivedDate: Date = new Date();
  error: any = '';
  error1: any = '';
  isAdmin: boolean = new Helper().isAdmin();

  cities: any[] = Cities;
  deliveries: any[] = [];
  productList: any[] = [];
  transport: any[] = Transports;
  status: any[] = STATUS;
  agencyList: any[] = [];

  pickupSelected: any = null;
  deliverySelected: any = null;
  transportSelected: any = null;
  statusSelected: any = {};
  agencySelected: any = null;

  order: Order = {
    id: 0,
    createdDate: '',
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

  date = new Date();
  testForm!: FormGroup;
  helper = new Helper();

  constructor(
    public dialogRef: MatDialogRef<DialogDetailOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    public dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.agencyList = this.helper.getAgencyList();
    this.productList = this.helper.getProductList();
    this.deliveries = this.helper.getDeliveryList();
    if (this.data && this.data.id !== 0) {
      this.header = 'Cập nhật thông tin đơn hàng';
      this.order.id = this.data.id;
      this.order.createdDate = this.data.createdDate;
      this.order.deliveryId = this.data.deliveryId;
      this.order.pickupId = this.data.pickupId;
      this.order.productTotal = this.data.productTotal;
      this.order.driver = this.data.driver;
      this.order.note = this.data.note;
      this.order.transport = this.data.transport;
      this.order.licensePlates = this.data.licensePlates;
      this.order.receivedDate = this.data.receivedDate;
      this.order.status = this.data.status;
      this.order.note = this.data.note;
      this.order.contract = this.data.contract;
      this.order.agencyId = this.data.agencyId;
      this.order.agencyName = this.data.agencyName;
      this.statusSelected = this.status.find(x => x.value === this.order.status);
      this.deliverySelected = this.deliveries.find(y => y.id === this.order.deliveryId);
      this.pickupSelected = this.cities.find(y => y.id === this.order.pickupId);
      this.transportSelected = this.transport.find(y => y.id === this.order.transport);
      this.agencySelected = this.agencyList.find(x => x.id === this.order.agencyId);
      this.setProductOrder();

      // set valuefor receivedDate picker
      const [day, month, year] = this.order.receivedDate.split('/');
      const date = new Date(+year, +month - 1, +day);
      this.testForm = new FormGroup({
        date: new FormControl(date),
      })
    }
  }

  setProductOrder() {
    this.order.products = this.productList;
    let listMap = this.order.products.map((e, i) => {
      let temp = this.data.products.find(element => element.id === e.id)
      if (temp) {
        e.quantity = temp.quantity;
      } else {
        e.quantity = 0;
      }
      return e;
    });

    const list: ProductItem[] = [];
    listMap.forEach(element => {
      const item = {
        id: element.id,
        name: element.name,
        quantity: element.quantity,
      };
      list.push(item);
    });
    this.order.products = list;
  }

  onSubmit() {
    if (this.onValidationForm()) {
      this.order.status = this.statusSelected.value;
      this.order.deliveryId = Number(this.deliverySelected.id);
      this.order.pickupId = Number(this.pickupSelected.id);
      this.order.transport = Number(this.transportSelected.id);
      this.order.products = this.order.products.filter(x => x.quantity !== 0);
      this.order.receivedDate = moment(this.testForm.value.date).format("DD/MM/YYYY");
      this.orderService.update(this.order).subscribe((response: any) => {
        console.log(response)
        if (response.affected && response.affected !== 0) {
          this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_ORDER', MSG_STATUS.SUCCESS));
          this.helper.updateOrder(this.order);
          this.helper.updateProductOrder(this.order.products);
          this.dialogRef.close(this.order);
        } else if (response.code === 404) {
          this.helper.showWarning(this.toastr, 'Không thể cập nhật thông tin đơn hàng do đơn hàng này đã được duyệt.');
          this.dialogRef.close(null);
        } else {
          this.helper.showError(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_ORDER', MSG_STATUS.FAIL));
          this.dialogRef.close(null);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  focusOut() {
    console.log(this.order.products)
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
      return false;
    }
    if (this.order.productTotal === 0) {
      isValidForm = false;
      this.error1 = 'Vui lòng nhập số lượng sản phẩm';
      return false;
    } else {
      this.error = '';
      isValidForm = true;
      return true;
    }
  }

  onChange(event: any) {
    this.order.contract = event.contract;
  }

}
