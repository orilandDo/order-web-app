import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogDeleteConfirmComponent } from '../common/dialog-delete-confirm/dialog-delete-confirm.component';
import { Order } from '../models/order';
import { DialogDetailOrderComponent } from './dialog-detail-order/dialog-detail-order.component';
import { Helper } from '../helpers/helper';
import { DialogConfirmOrderComponent } from './dialog-confirm-order/dialog-confirm-order.component';
import { Cities, SERVICE_TYPE, STATUS } from '../constants/const-data';
import { CustomPaginator } from '../common/custom-paginator';
import { DeliveryData } from '../mock-data/delivery-data';
import { PRODUCT_DATA } from '../mock-data/products-data';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class OrderListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['isView', 'id', 'createdDate', 'contract', 'receivedDate', 'deliveryId', 'pickupId', 'productName', 'quantity', 'productTotal', 'licensePlates', 'driver', 'status', 'deleteAction'];
  colspan: number = 0;
  dataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cities: any[] = Cities;
  deliveries: any[] = DeliveryData;
  products: any[] = PRODUCT_DATA;
  productList: any[] = [];
  status: any[] = STATUS;
  helper = new Helper();
  isAdmin: boolean = new Helper().isAdmin();

  agencyList: any[] = [];
  // agencyList: any[] = AGENCY_DATA;
  agencySelected: any = null;
  productSelected: any = null;
  selectedStatus: any = null;

  hasData: boolean = false;
  fileNameExcel: string = 'Danh-sach-don-dat-hang.xlsx';

  searchForm: any = {
    orderId: 0,
    agencyId: 0,
    productId: 0,
    status: 0,
    startDate: '',
    endDate: ''
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.colspan = this.displayedColumns.length;
    this.productList = this.helper.getProductList();
    this.agencyList = this.helper.getAgencyList();
    // const orderList = this.helper.getOrderList();
    // if (orderList.length === 0) {
    this.orderService.getOrderList().subscribe((response: any) => {
      console.log(response)
      this.helper.setOrderList(response);
      this.dataSource.data = response.length > 0 ? response.reverse() : [];

      // this.dataSource.data = []
      if (this.dataSource.data.length === 0) {
        this.hasData = false;
      } else {
        this.hasData = true;
      }
    });
    // } else {
    //   this.dataSource.data = orderList.length > 0 ? orderList.reverse() : [];
    // }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    const element = document.getElementsByClassName('mat-mdc-paginator-page-size-label');
    if (element) {
      element[0].innerHTML = 'S??? d??ng hi???n th???: ';
    }
  }

  onAdd() {
    this.router.navigate(['orders/add']);
  }

  onEdit(row: any) {
    console.log(row)
    if (row && row.status !== 1) {
      const dialogRef = this.dialog.open(DialogConfirmOrderComponent, {
        data: row,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dataSource.data = this.helper.getOrderList().reverse();
        const r = this.dataSource.data.find(x => x.id === row.id);
        if (r) {
          r.isViewed = true;
        }
      });
    } else {
      const dialogRef = this.dialog.open(DialogDetailOrderComponent, {
        data: row,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== null) {
          row.deliveryId = result.deliveryId;
          row.pickupId = result.pickupId;
          row.productTotal = result.productTotal;
          row.transport = result.transport;
          row.licensePlates = result.licensePlates;
          row.contract = result.contract;
          row.driver = result.driver;
          row.receivedDate = result.receivedDate;
          row.note = result.note;
          row.status = result.status;
          row.products = result.products;
        }
        const r = this.dataSource.data.find(x => x.id === row.id);
        if (r) {
          r.isViewed = true;
        }
      });
    }
  }

  onDelete(row: any) {
    console.log(row.id)
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      data: { id: row.id, type: SERVICE_TYPE.ORDERSERVICE, content: 'B???n ch???c ch???n mu???n x??a ????n h??ng n??y kh??ng?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      if (result) {
        this.helper.deleteOrder(row);
        this.dataSource.data = this.dataSource.data.filter(x => x.id !== row.id);
      }
      console.log(this.dataSource.data);
    });
  }

  onPrint(row: any) {
    this.router.navigate(['print'], row);
  }

  exportToExcel() {
    const data = this.dataSource.data.map(c => ({
      'M?? s??? ????n h??ng': c.id,
      'Ng??y t???o ????n': c.createdDate,
      'Nh?? ph??n ph???i': this.agencyList.find(x => x.id === c.agencyId)?.fullName,
      'H???p ?????ng': c.contract,
      'Ng??y nh???n d??? ki???n': c.receivedDate,
      'N??i nh???n': this.deliveries.find(x => x.id === c.deliveryId)?.label,
      'N??i giao': this.cities.find(x => x.id === c.pickupId)?.label,
      'S???n ph???m': this.getProductName(c.products),
      'S??? l?????ng': this.getProductQuantity(c.products),
      'T???ng s??? l?????ng': c.productTotal,
      'S??? ph????ng ti???n': c.licensePlates,
      'T??n t??i x???': c.driver,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    wb.Sheets['Sheet1']['H2'].s = { alignment: { wrapText: true } };
    XLSX.writeFile(wb, this.fileNameExcel);
  }

  getProductName(products: any[]): string {
    let str = '';
    products.forEach(el => {
      str += el.name + ',\n';
    });
    return str;
  }

  getProductQuantity(products: any[]): string {
    let str = '';
    products.forEach(el => {
      str += el.quantity + ',\n';
    });
    return str;
  }

  onSearch() {
    this.searchForm.agencyId = this.agencySelected !== null ? this.agencySelected.id : 0;
    this.searchForm.productId = this.productSelected !== null ? this.productSelected.id : 0;
    this.searchForm.status = this.selectedStatus !== null ? this.selectedStatus.value : 0;
    this.searchForm.startDate = this.range.value.start !== null ? moment(this.range.value.start).format('DD/MM/YYYY') : '';
    this.searchForm.endDate = this.range.value.end !== null ? moment(this.range.value.end).format('DD/MM/YYYY') : '';
    console.log(this.searchForm)
    this.orderService.search(this.searchForm).subscribe((response: any) => {
      console.log(response)
      if (response.length > 0) {
        this.dataSource.data = response.reverse();
        this.resetFormSearch();
      } else {
        this.dataSource.data = [];
        this.helper.showWarning(this.toastr, "Kh??ng c?? th??ng tin c???n t??m.");
        this.resetFormSearch();
      }
    });
  }

  resetFormSearch() {
    this.agencySelected = null;
    this.productSelected = null;
    this.selectedStatus = null;
    this.range.value.start = null;
    this.range.value.end = null;
    this.searchForm.orderId = 0;
    this.searchForm.agencyId = 0;
    this.searchForm.productId = 0;
    this.searchForm.status = 0;
    this.searchForm.startDate = null;
    this.searchForm.endDate = null;
  }

  compareObj(obj1: any[], obj2: any): string {
    const obj = obj1.find(x => x.id === obj2);
    if (obj) {
      return obj.label;
    }
    return '';
  }

}
