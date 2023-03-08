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
import { AGENCY_DATA } from '../mock-data/agency-data';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class OrderListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'createdDate', 'contract', 'receivedDate', 'deliveryId', 'pickupId', 'productName', 'quantity', 'productTotal', 'licensePlates', 'driver', 'status', 'deleteAction'];
  dataSource = new MatTableDataSource<Order>();
  clickedRows = new Set<Order>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cities: any[] = Cities;
  deliveries: any[] = DeliveryData;
  products: any[] = PRODUCT_DATA;
  status: any[] = STATUS;
  helper = new Helper();
  isAdmin: boolean = new Helper().isAdmin();

  agencyList: any[] = AGENCY_DATA;
  agencySelected: any = null;

  productSelected: any = null;
  selectedStatus: any = null;

  searchForm: any = {
    id: 0,
    agency: 0,
    createdDate: moment().format('DD/MM/YYYY'),
    product: 0,
    status: 0,
    start: '',
    end: ''
  }
  //select = {};
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(public dialog: MatDialog,
    public router: Router, 
    private route: ActivatedRoute,
    private orderService: OrderService,
    ) { }

  ngOnInit(): void {
    const orderList = this.helper.getOrderList();
    if (orderList.length === 0) {
      this.orderService.getOrderList().subscribe((response: any) => {
        console.log(response)
        this.dataSource.data = response.length > 0 ? response.reverse() : [];
      });
    } else {
      this.dataSource.data = orderList.length > 0 ? orderList.reverse() : [];
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // openDialog(row: any): void {
  //   console.log(row)
  //   const dialogRef = this.dialog.open(DialogDetailOrderComponent, {
  //     data: row,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     //row = result;
  //   });
  // }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    const element = document.getElementsByClassName('mat-mdc-paginator-page-size-label');
    if (element) {
      element[0].innerHTML = 'Số dòng hiển thị: ';
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
        this.dataSource.data = this.helper.getOrderList();
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
      });
    }
  }

  onDelete(row: any) {
    console.log(row.id)
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      data: { id: row.id, type: SERVICE_TYPE.ORDERSERVICE, content: 'Bạn chắc chắn muốn xóa đơn hàng này không?' },
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
    // xuat don dat hang
    alert('In chi tiết đơn hàng dạng pdf')
  }

  // onDownloadPDF(row: any) {
  //   // xuat danh sach don dat hang
  //   console.log('Download pdf')
  // }

  exportExcel() {
    alert('Tải xuống danh sách đơn hàng, định dạng excel')
  }

  onSearch() {
    this.searchForm.agency = this.agencySelected !== null ? this.agencySelected.id : 0;
    this.searchForm.createdDate = '';
    this.searchForm.product = this.productSelected !== null ? this.productSelected.id : 0;
    this.searchForm.status = this.selectedStatus !== null ? this.selectedStatus.value : 0;
    this.searchForm.start = this.range.value.start !== null ? moment(this.range.value.start).format('DD/MM/YYYY') : '';
    this.searchForm.end = this.range.value.end !== null ? moment(this.range.value.end).format('DD/MM/YYYY') : '';
    console.log(this.searchForm)
    alert('Tìm kiếm đơn hàng')
  }

  compareObj(obj1: any[], obj2: any): string {
    const obj = obj1.find(x => x.id === obj2);
    if (obj) {
      return obj.label;
    }
    return '';
  }

}
