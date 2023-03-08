import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../helpers/helper';
import { MSG_STATUS, SERVICE_TYPE } from '../../constants/const-data';
import { AgencyService } from '../../services/agency.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-delete-confirm',
  templateUrl: './dialog-delete-confirm.component.html',
  styleUrls: ['./dialog-delete-confirm.component.scss']
})
export class DialogDeleteConfirmComponent implements OnInit {
  helper = new Helper();

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private agencyService: AgencyService,
    private orderService: OrderService,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  onSubmit(data: any) {
    switch (data.type) {
      case SERVICE_TYPE.PRODUCTSERVICE:
        this.productService.delete(data.id).subscribe((response) => {
          this.onResponse(data.id, 'MESSAGE.DELETE_PRODUCT', response);
        });
        break;
      case SERVICE_TYPE.AGENCYSERVICE:
        this.agencyService.delete(data.id).subscribe((response) => {
          this.onResponse(data.id, 'MESSAGE.DELETE_AGENCY', response);
        });
        break;
      case SERVICE_TYPE.ORDERSERVICE:
        this.orderService.delete(data.id).subscribe((response) => {
          this.onResponse(data.id, 'MESSAGE.DELETE_ORDER', response);
        });
        break;
    }
  }

  onResponse(id: number, key: string, response: any) {
    console.log(response)
    if (response) {
      this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, key, MSG_STATUS.SUCCESS));
      this.dialogRef.close(id);
      console.log('Đã xóa ' + id)
    } else {
      this.helper.showError(this.toastr, this.helper.getMessage(this.translate, key, MSG_STATUS.FAIL));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
