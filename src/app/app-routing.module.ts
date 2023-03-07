import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmrrHomeComponent } from './amrr-home/amrr-home.component';
import { AmrrChangePasswordComponent } from './auth/amrr-change-password/amrr-change-password.component';
import { AmrrLoginComponent } from './auth/amrr-login/amrr-login.component';
import { AuthGuard } from './auth/auth.guard';
import { AmrrAccessLogComponent } from './master/amrr-access-log/amrr-access-log.component';

import { AmrrBayComponent } from './master/amrr-bay/amrr-bay.component';
import { AmrrGodownComponent } from './master/amrr-godown/amrr-godown.component';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { AmrrUserComponent } from './master/amrr-user/amrr-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BatchwiseStockComponent } from './reports/batchwise-stock/batchwise-stock.component';
import { ConsolidatedStockReportComponent } from './reports/consolidated-stock-report/consolidated-stock-report.component';
import { ItemMovementReportComponent } from './reports/item-movement-report/item-movement-report.component';
import { StockAdjustmentEditorComponent } from './stock-adjustment/stock-adjustment-editor/stock-adjustment-editor.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { StockInwardEditorComponent } from './stock-inward/stock-inward-editor/stock-inward-editor.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';
import { StockOutwardEditorComponent } from './stock-outward/stock-outward-editor/stock-outward-editor.component';
import { StockOutwardComponent } from './stock-outward/stock-outward.component';

const routes: Routes = [
  { path: 'login', component: AmrrLoginComponent },
  {
    path: '',
    component: AmrrHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'stockInward', component: StockInwardComponent },
      { path: 'stockInward/edit/:id', component: StockInwardEditorComponent },
      { path: 'stockOutward', component: StockOutwardComponent },
      { path: 'stockOutward/edit/:id', component: StockOutwardEditorComponent },
      { path: 'stockAdjustment', component: StockAdjustmentComponent },
      {
        path: 'stockAdjustment/edit/:id',
        component: StockAdjustmentEditorComponent,
      },
      {
        path: 'reports/consolidatedStock',
        component: ConsolidatedStockReportComponent,
      },
      {
        path: 'reports/batchwiseStock',
        component: BatchwiseStockComponent,
      },
      {
        path: 'reports/itemMovement',
        component: ItemMovementReportComponent,
      },
      { path: 'itemGroup', component: AmrrItemGroupComponent },
      { path: 'item', component: AmrrItemComponent },
      { path: 'godown', component: AmrrGodownComponent },
      { path: 'bay', component: AmrrBayComponent },
      { path: 'user', component: AmrrUserComponent },
      { path: 'changePassword', component: AmrrChangePasswordComponent },
      { path: 'accessLogs', component: AmrrAccessLogComponent },
    ],
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
