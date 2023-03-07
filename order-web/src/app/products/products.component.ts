import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product';
import { CustomPaginator } from '../common/custom-paginator';
import { DialogDeleteConfirmComponent } from '../common/dialog-delete-confirm/dialog-delete-confirm.component';
import { PRODUCT_DATA } from '../mock-data/products-data';
import { ProductService } from '../services/product.service';
import { DialogDetailProductComponent } from './dialog-detail-product/dialog-detail-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ProductsComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'productName', 'quantity', 'price', 'note', 'deleteAction'];
  dataSource = new MatTableDataSource<Product>(PRODUCT_DATA);
  clickedRows = new Set<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private productService: ProductService,
  ) { }
  
  ngOnInit(): void {
    // this.productService.getProductList().subscribe((response: any) => {
    //   console.log(response)
    //   this.dataSource.data = response;
    // });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onEdit(row: any) {
    console.log(row)
    const dialogRef = this.dialog.open(DialogDetailProductComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        if (row && row.id !== 0) {
          row.name = result.name;
          row.price = result.price;
          row.quantity = result.quantity;
          row.note = result.note;
        } else {
          this.dataSource.data.push(result);
          this.dataSource.data = this.dataSource.data; // push obj into datasource
        }
      }
    });
  }

  onDelete(row: any) {
    console.log(row.id)
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      data: { id: row.id, content: 'Bạn chắc chắn muốn xóa sản phẩm "' + row.name + '"?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(x => x.id !== row.id);
      }
      console.log(this.dataSource.data);
    });
  }

}

