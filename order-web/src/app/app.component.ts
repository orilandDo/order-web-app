import { Component, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from './common/config';
import { Helper, INavbarData } from './helpers/helper';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;
  isLoginSuccess: boolean = false;

  constructor(public translate: TranslateService) {
     translate.setDefaultLang('i18n');
   }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  ngOnInit() {
    console.log('app.component')
    this.isLoginSuccess = false;
    const session = sessionStorage.getItem(CONFIG.SESSION_STORAGE.JWT);
    if (session && Number(session) === 1) {
      this.isLoginSuccess = true;
    } else {
      this.isLoginSuccess = false;
    }
  }
}
