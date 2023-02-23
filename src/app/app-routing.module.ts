import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';

const routes: Routes = [
  { path: 'stockInward', component: StockInwardComponent },
  { path: 'itemGroup', component: AmrrItemGroupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
