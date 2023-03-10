import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './orders/order-list.component';
import { ProductsComponent } from './products/products.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AgencyComponent } from './agency/agency.component';
import { AuthGuardGuard } from './services/guards/auth-guard.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { NotifyComponent } from './notify/notify.component';
import { OrderAddComponent } from './orders/order-add/order-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  {
    path: 'orders', children: [
      { path: 'list', component: OrderListComponent},
      { path: 'add', component: OrderAddComponent},
    ]
  },
  { path: 'products', component: ProductsComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'agency', component: AgencyComponent },
  { path: 'logout', component: LogoutComponent},
  { path: 'notify', component: NotifyComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
