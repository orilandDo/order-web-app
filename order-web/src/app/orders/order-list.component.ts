import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { ProductService } from '../services/product.service';
import { AgencyService } from '../services/agency.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { DomSanitizer } from '@angular/platform-browser';

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
  @ViewChild('TABLE', { static: false }) TABLE!: ElementRef;

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

  fileName: string = 'Danh-sach-don-dat-hang.xlsx';

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
    private productService: ProductService,
    private agencyService: AgencyService,
    private toastr: ToastrService,
    public translate: TranslateService,
    protected sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.productList = this.helper.getProductList();
    this.agencyList = this.helper.getAgencyList();
    // const orderList = this.helper.getOrderList();
    // if (orderList.length === 0) {
    this.orderService.getOrderList().subscribe((response: any) => {
      console.log(response)
      this.helper.setOrderList(response);
      this.dataSource.data = response.length > 0 ? response.reverse() : [];
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
        this.dataSource.data = this.helper.getOrderList().reverse();
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
    //var blob = new Blob([row.blob()], { type: 'application/pdf' });
    // const blobUrl = URL.createObjectURL(blob);
    //   const iframe = document.createElement('iframe');
    //   iframe.style.display = 'none';
    //   iframe.src = blobUrl;
    //   document.body.appendChild(iframe);
    //   iframe.contentWindow ? iframe.contentWindow.print() : null;


    const pdf = new Blob([row], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(pdf);
    const iframe = document.createElement('iframe');

    iframe.style.display = 'none';
    //iframe.src = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
    document.body.appendChild(iframe);
    iframe.contentWindow ? iframe.contentWindow.print() : null;
  }

  exportToExcel() {
    const data = this.dataSource.data.map(c => ({ 
      'Mã số đơn hàng': c.id, 
      'Ngày tạo đơn': c.createdDate,
      'Nhà phân phối': this.agencyList.find(x => x.id === c.agencyId)?.fullName,
      'Hợp đồng': c.contract,
      'Ngày nhận dự kiến': c.receivedDate,
      'Nơi nhận': this.deliveries.find(x => x.id === c.deliveryId)?.label,
      'Nơi giao': this.cities.find(x => x.id === c.pickupId)?.label,
      'Sản phẩm': this.getProductName(c.products),
      'Số lượng': this.getProductQuantity(c.products),
      'Tổng số lượng': c.productTotal,
      'Số phương tiện': c.licensePlates,
      'Tên tài xế': c.driver,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    wb.Sheets['Sheet1']['H2'].s = {alignment:{ wrapText: true }};
    XLSX.writeFile(wb, this.fileName);
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
        this.helper.showWarning(this.toastr, "Không có thông tin cần tìm.");
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
