import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyErrorStateMatcher } from '../../orders/order-add/order-add.component';
import { Agency } from '../../models/agency';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../helpers/helper';
import { MSG_STATUS } from '../../constants/const-data';
import { AgencyService } from '../../services/agency.service';
import { UserService } from '../../services/user.service';
import { CONFIG } from '../../common/config';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-dialog-detail-agency',
  templateUrl: './dialog-detail-agency.component.html',
  styleUrls: ['./dialog-detail-agency.component.scss']
})
export class DialogDetailAgencyComponent implements OnInit {
  header: string = '';
  error: any = '';
  disabled: boolean = false;

  matcher = new MyErrorStateMatcher();
  agency = {
    id: 0,
    fullName: '',
    address: '',
    contract: '',
    phone: '',
    note: '',
    accountName: '',
    password: '',
    confirmPassword: '',
    email: '',
    userId: 0,
  };

  helper = new Helper();

  constructor(
    public dialogRef: MatDialogRef<DialogDetailAgencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agency,
    public translate: TranslateService,
    private toastr: ToastrService,
    private agencyService: AgencyService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.id !== 0) {
      this.disabled = true;
      this.translate.get('AGENCY.TITLE_MODIFIED').subscribe(data => { this.header = data });
      this.agency.id = this.data.id;
      this.agency.fullName = this.data.fullName;
      this.agency.address = this.data.address;
      this.agency.phone = this.data.phone;
      this.agency.note = this.data.note;
      this.agency.accountName = this.data.accountName;
      this.agency.password = this.data.password;
      this.agency.email = this.data.email;
      this.agency.contract = this.data.contract;
    } else {
      this.translate.get('AGENCY.TITLE_ADD').subscribe(data => { this.header = data });
      this.header
      this.disabled = false;
    }
  }

  onSubmit() {
    if (this.validForm()) {
      if (this.agency.id === 0) {
        // Call api insert
        this.agencyService.create(this.agency).subscribe((response: any) => {
          console.log(response)
          debugger
          if (response) {
            this.agency.id = response.id;
            this.agency.userId = response.userId;
            this.helper.addAgency(this.agency);

            // Add user to storage
            // Encrypt password
            //var passwordEncrypt = CryptoJS.AES.encrypt(this.agency.password, CONFIG.SECRET_KEY).toString();
            const user: User = {
              id: response.userId,
              username: this.agency.accountName,
              password: this.agency.password,
              isAdmin: false,
            };
            this.helper.addUser(user);

            this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.ADD_AGENCY', MSG_STATUS.SUCCESS));
            this.dialogRef.close(this.agency);
          } else {
            this.helper.showError(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.ADD_AGENCY', MSG_STATUS.FAIL));
          }
        });
      } else {
        // Call api update
        this.agencyService.update(this.agency).subscribe((response: any) => {
          console.log(response)
          if (response) {
            this.helper.updateAgency(this.agency);
            this.helper.showSuccess(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_AGENCY', MSG_STATUS.SUCCESS));
            this.dialogRef.close(this.agency);
          } else {
            this.helper.showError(this.toastr, this.helper.getMessage(this.translate, 'MESSAGE.MODIFIED_AGENCY', MSG_STATUS.FAIL));
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  validForm(): boolean {
    let isValidForm: boolean = true;
    if (this.agency.fullName.length === 0) {
      isValidForm = false;
    } else if (this.agency.address.length === 0) {
      isValidForm = false;
    } else if (this.agency.contract.length === 0) {
      isValidForm = false;
    } else if (this.agency.email.length === 0) {
      isValidForm = false;
    } else if (this.agency.accountName.length === 0) {
      isValidForm = false;
    } else if (this.agency.phone.length === 0) {
      isValidForm = false;
      // } else if (this.agency.password.length === 0) {
      //   isValidForm = false;
    } else if (this.agency.id === 0 && this.agency.confirmPassword.length === 0) {
      isValidForm = false;
    } else {
      this.error = '';
      isValidForm = true;
    }

    if (!isValidForm) {
      this.error = 'Vui l??ng nh???p ?????y ????? th??ng tin b???t bu???c (*)';
    }
    return isValidForm;
  }

}
