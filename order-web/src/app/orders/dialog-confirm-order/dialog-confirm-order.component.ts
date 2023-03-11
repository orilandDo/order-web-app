import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cities, MSG_STATUS, STATUS, Transports } from '../../constants/const-data';
import { Order } from '../../models/order';
import { Helper } from '../../helpers/helper';
import { PRODUCT_DATA } from '../../mock-data/products-data';
import { DeliveryData } from '../../mock-data/delivery-data';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dialog-confirm-order',
  templateUrl: './dialog-confirm-order.component.html',
  styleUrls: ['./dialog-confirm-order.component.scss']
})
export class DialogConfirmOrderComponent implements OnInit {

  order: Order = {
    id: 0,
    createdDate: '',
    selectedDelivery: '',
    deliveryId: 0,
    selectedPickup: '',
    pickupId: 0,
    productTotal: 0,
    driver: '',
    note: '',
    transport: 0,
    selectedTransport: '',
    licensePlates: '',
    receivedDate: '',
    status: 0,
    contract: '',
    products: [],
    agencyId: 0,
    agencyName: ''
  };

  cities: any[] = Cities;
  deliveries: any[] = DeliveryData;
  products: any[] = PRODUCT_DATA;
  transport: any[] = Transports;
  status: any[] = STATUS;
  agencyList: any[] = [];

  helper: Helper = new Helper();
  isAdmin: boolean = new Helper().isAdmin();
  selectedStatus: any = {};
  selectedDelivery: any = {};
  selectedPickup: any = {};
  selectedTransport: any = {};

  constructor(public dialogRef: MatDialogRef<DialogConfirmOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    public translate: TranslateService,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) {

  }

  ngOnInit(): void {
    this.agencyList = this.helper.getAgencyList();
    if (this.data && this.data.id !== 0) {
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
      this.order.products = this.data.products;
      this.order.contract = this.data.contract;
      this.order.agencyId = this.data.agencyId;
      this.order.agencyName = this.agencyList.find(x => x.id === this.data.agencyId).fullName;
      this.selectedStatus = this.status.find(x => x.value === this.order.status);
      this.selectedDelivery = this.deliveries.find(x => x.id === this.order.deliveryId);
      this.selectedPickup = this.cities.find(x => x.id === this.order.pickupId);
      this.selectedTransport = this.transport.find(x => x.id === this.order.transport);
    }
  }

  onSubmit() {
    this.order.status = this.selectedStatus.value;
    this.orderService.updateStatus(this.order).subscribe((response: any) => {
      console.log(response)
      if (response.affected !== 0) {
        this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_ORDER', MSG_STATUS.SUCCESS));
        this.helper.updateStatusOrder(this.order.id, this.order.status);
        this.dialogRef.close(this.order);
      } else {
        this.helper.showError(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_ORDER', MSG_STATUS.FAIL));
        this.dialogRef.close(null);
      }
    });
  }
}
