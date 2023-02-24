import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';

const routes: Routes = [
  { path: 'stockInward', component: StockInwardComponent },
  { path: 'itemGroup', component: AmrrItemGroupComponent },
  { path: 'item', component: AmrrItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
