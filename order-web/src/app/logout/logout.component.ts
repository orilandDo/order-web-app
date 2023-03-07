import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from '../helpers/helper';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  helper: Helper = new Helper;
  navigateComponent: string = 'login';
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.helper.clearSession();
    this.router.navigateByUrl(this.navigateComponent);
  }
    
}
