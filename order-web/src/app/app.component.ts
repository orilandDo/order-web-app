import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Helper } from './helpers/helper';
import { LoginService } from './services/login.service';

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
  isAuthenticated: boolean = false;
  helper = new Helper();

  constructor(public translate: TranslateService,
    public loginService: LoginService,
    private cdr: ChangeDetectorRef) {
    translate.setDefaultLang('i18n');
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  ngOnInit() {
    this.helper.checkSession();
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
}
