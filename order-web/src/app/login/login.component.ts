import { Component, OnInit } from '@angular/core';
import { Helper } from '../helpers/helper';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = 'admin';
  password: string = '123aaa';

  isUsernameValid: boolean = true;
  isPasswordValid: boolean = true;
  error: string = '';
  helper: Helper = new Helper();

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    // check session
    this.helper.checkSession();

    this.loginService
      .errorSubject
      .subscribe((errorMessage: any) => {
        this.error = errorMessage;
      });
  }

  validationUsername(): boolean {
    const pattern = RegExp(/^[\w~.]*$/);
    if (pattern.test(this.username)) {
      this.isUsernameValid = true;
      return true;
    } 
    this.isUsernameValid = false;
    return false;
  }

  validationPassword(): boolean {
    if (this.password.length === 0) {
      this.isPasswordValid = false;
      return false;
    }
    this.isPasswordValid = true;
    return true;
  }

  onKey(event: any, type: string) {
    this.error = '';
    if (type === 'username') {
      this.username = event.target.value;
    } else if (type === 'password') {
      this.password = event.target.value;
    }
  }

  onSubmit() {
    if (this.validationUsername() && this.validationPassword()) {
      this.loginService.login(this.username.trim(), this.password.trim());
      this.loginService
      .errorSubject
      .subscribe((errorMessage: any) => {
        this.error = errorMessage;
      });
    } else {
      this.error = 'Username or password is invalid.';
    }
  }

}
