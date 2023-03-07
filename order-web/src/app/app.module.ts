import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AgencyComponent } from './agency/agency.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from './common/material.module';
import { OrderListComponent } from './orders/order-list.component';
import { LoginComponent } from './login/login.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from './common/date-format';
import { DialogDetailOrderComponent } from './orders/dialog-detail-order/dialog-detail-order.component';
import { DialogDetailAgencyComponent } from './agency/dialog-detail-agency/dialog-detail-agency.component';
import { DialogDetailProductComponent } from './products/dialog-detail-product/dialog-detail-product.component';
import { DialogConfirmOrderComponent } from './orders/dialog-confirm-order/dialog-confirm-order.component';
import { DialogDeleteConfirmComponent } from './common/dialog-delete-confirm/dialog-delete-confirm.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './common/custom-paginator';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotifyComponent } from './notify/notify.component';
import { OrderAddComponent } from './orders/order-add/order-add.component';
import { ToastrModule } from 'ngx-toastr';
import { WebReqInterceptor } from './services/web-req.interceptor';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    BodyComponent,
    DashboardComponent,
    ProductsComponent,
    StatisticsComponent,
    AgencyComponent,
    OrderListComponent,
    OrderAddComponent,
    LoginComponent,
    SublevelMenuComponent,
    PageNotFoundComponent,
    LogoutComponent,
    DialogDetailOrderComponent,
    DialogDetailAgencyComponent,
    DialogDetailProductComponent,
    DialogConfirmOrderComponent,
    DialogDeleteConfirmComponent,
    NotifyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
    }), // ToastrModule added
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat },
  { provide: MatPaginatorIntl, useValue: CustomPaginator() },
  { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in");
  }
}
