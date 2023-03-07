import { Component, OnInit } from '@angular/core';
import { Helper } from '../helpers/helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  helper: Helper = new Helper();

  ngOnInit() {
    this.helper.checkSession();
  }

}
