import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG } from '../common/config';
import { Helper, INavbarData } from '../helpers/helper';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  navigateComponent: string = 'dashboard';
  username: string = 'admin';
  password: string = '123aaa';

  isUsernameValid: boolean = true;
  isPasswordValid: boolean = true;
  error: string = '';
  helper: Helper = new Helper();

  constructor(private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('login')
    // check session
    this.helper.checkSession();
    const session = sessionStorage.getItem(CONFIG.SESSION_STORAGE.JWT);
    if (Number(session) === 1) {
      this.router.navigate([this.navigateComponent]);
    }
  }

  validationUsername(): boolean {
    let pattern = RegExp(/^[\w~.]*$/);
    if (pattern.test(this.username)) {
      this.isUsernameValid = true;
      return true;
    } else {
      pattern = RegExp(/^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i);
      if (pattern.test(this.username)) {
        this.isUsernameValid = true;
        return true;
      }
    }
    this.error = 'Tên đăng nhập không thể chứa kí tự đặc biệt.';
    this.isUsernameValid = false;
    return false;
  }

  validationPassword(): boolean {
    if (this.password.length === 0) {
      this.isPasswordValid = false;
      this.error = 'Tên đăng nhập hoặc mật khẩu không đúng.';
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
      this.loginService.errorSubject.subscribe((errorMessage: any) => {
        if (errorMessage) {
          this.error = errorMessage;
        }
      });
    } else {
      this.error = 'Tên đăng nhập hoặc mật khẩu không đúng.';
    }
  }

}
