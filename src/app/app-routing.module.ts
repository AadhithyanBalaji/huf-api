import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';

const routes: Routes = [
  {path: '', redirectTo: '/stockInward', pathMatch: 'full'},
  {path: 'stockInward', component: StockInwardComponent},
  { path: '*', pathMatch: 'full', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
