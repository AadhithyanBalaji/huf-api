import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmrrHomeComponent } from './amrr-home/amrr-home.component';
import { AmrrLoginComponent } from './auth/amrr-login/amrr-login.component';
import { AuthGuard } from './auth/amrr-login/auth.guard';
import { AmrrBayComponent } from './master/amrr-bay/amrr-bay.component';
import { AmrrGodownComponent } from './master/amrr-godown/amrr-godown.component';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';

const routes: Routes = [
  { path: 'login', component: AmrrLoginComponent },
  {
    path: '',
    component: AmrrHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'stockInward', component: StockInwardComponent },
      { path: 'itemGroup', component: AmrrItemGroupComponent },
      { path: 'item', component: AmrrItemComponent },
      { path: 'godown', component: AmrrGodownComponent },
      { path: 'bay', component: AmrrBayComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
