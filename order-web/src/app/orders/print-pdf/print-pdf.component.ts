import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cities, STATUS } from '../../constants/const-data';
import { Helper } from '../../helpers/helper';
import { DeliveryData } from '../../mock-data/delivery-data';
import { PRODUCT_DATA } from '../../mock-data/products-data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ORDERS_DATA } from 'src/app/mock-data/orders-data';
import { NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.scss']
})
export class PrintPdfComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'createdDate', 'contract', 'receivedDate', 'deliveryId', 'pickupId', 'productName', 'quantity', 'productTotal', 'licensePlates', 'driver'];
  dataSource = new MatTableDataSource<any>(ORDERS_DATA);

  cities: any[] = Cities;
  deliveries: any[] = DeliveryData;
  products: any[] = PRODUCT_DATA;
  productList: any[] = [];
  status: any[] = STATUS;
  agencyList: any[] = [];
  helper = new Helper();
  agencySelected: any = null;
  productSelected: any = null;
  selectedStatus: any = null;

  fileNamePdf: string = 'don-dat-hang.pdf';
  data: any;

  public config = {
    printMode: 'template-popup',
    popupProperties: 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes',
    pageTitle: 'Chi tiết đơn hàng',
    templateString: '<header></header>{{printBody}}<footer></footer>',
    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: [
      'td { border: 1px solid grey; color: black; grey; }',
      'th { border: 1px solid grey; }',
      'table { border: 1px solid grey; color: black; margin:auto }',
      '.header, table, footer { margin: auto; text-align: center; }',
      '.header {padding-bottom: 1rem;}',
      '@media print{@page {size: landscape; top: 1rem; margin: 0px !important;}}',
      '.nowrap { white-space: pre !important;}',
      '.container {width: 100%;  min-width: 100%;}',
      'html {margin: 0}'
    ]
  }

  constructor(public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public print: NgxPrintElementService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras;
  }

  ngOnInit(): void {
    let orderList = this.helper.getOrderList();
    this.dataSource.data = orderList.filter(x => x.id === this.data.id);
  }

  compareObj(obj1: any[], obj2: any): string {
    const obj = obj1.find(x => x.id === obj2);
    if (obj) {
      return obj.label;
    }
    return '';
  }

  onCancel() {
    this.router.navigate(['orders/list']);
  }

}

