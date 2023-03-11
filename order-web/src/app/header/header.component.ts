import { Component, Input, OnInit } from '@angular/core';
import { Helper } from '../helpers/helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  helper = new Helper();
  agency: string = '';

  ngOnInit(): void {
    this.agency = this.helper.getInfoName();
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else if (this.collapsed
      && this.screenWidth <= 768
      && this.screenWidth > 0) {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }
}
