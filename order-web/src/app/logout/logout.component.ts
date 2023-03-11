import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from '../helpers/helper';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  helper: Helper = new Helper;
  navigateComponent: string = 'login';
  
  constructor(private router: Router,
    public loginService: LoginService
    ) {}

  ngOnInit(): void {
    this.loginService.logOut();
  }
    
}
