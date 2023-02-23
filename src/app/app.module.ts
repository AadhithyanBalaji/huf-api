import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockInwardComponent } from './stock-inward/stock-inward.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/ammr-grid/shared.module';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrPageHeaderComponent } from './shared/amrr-page-header/amrr-page-header.component';
import { AmrrItemGroupEditorComponent } from './master/amrr-item-group/amrr-item-group-editor/amrr-item-group-editor.component';
import { ApiBusinessService } from './shared/api-business.service';
import { AmrrModalComponent } from './shared/amrr-modal/amrr-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    StockInwardComponent,
    PageNotFoundComponent,
    AmrrItemGroupComponent,
    AmrrPageHeaderComponent,
    AmrrItemGroupEditorComponent,
    AmrrModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [ApiBusinessService],
  bootstrap: [AppComponent],
})
export class AppModule {}
