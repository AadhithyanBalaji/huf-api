import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { AmrrItemEditorComponent } from './master/amrr-item/amrr-item-editor/amrr-item-editor.component';
import { AmrrTypeaheadComponent } from './shared/amrr-typeahead/amrr-typeahead.component';
import { GlobalErrorHandler } from './shared/global-error-handler';
import { AmrrLoadingComponent } from './shared/amrr-loading/amrr-loading.component';
import { HttpLoadingInterceptor } from './shared/http-loading.interceptor';
import { AmrrLoadingDialogService } from './shared/amrr-loading/amrr-loading-dialog.service';
import { AmrrGodownComponent } from './master/amrr-godown/amrr-godown.component';
import { AmrrGodownEditorComponent } from './master/amrr-godown/amrr-godown-editor/amrr-godown-editor.component';
import { AmrrBayComponent } from './master/amrr-bay/amrr-bay.component';
import { AmrrBayEditorComponent } from './master/amrr-bay/amrr-bay-editor/amrr-bay-editor.component';
import { AmrrTypeaheadMultiselectComponent } from './shared/amrr-typeahead-multiselect/amrr-typeahead-multiselect.component';

@NgModule({
  declarations: [
    AppComponent,
    StockInwardComponent,
    PageNotFoundComponent,
    AmrrItemGroupComponent,
    AmrrPageHeaderComponent,
    AmrrItemGroupEditorComponent,
    AmrrModalComponent,
    AmrrItemComponent,
    AmrrItemEditorComponent,
    AmrrTypeaheadComponent,
    AmrrLoadingComponent,
    AmrrGodownComponent,
    AmrrGodownEditorComponent,
    AmrrBayComponent,
    AmrrBayEditorComponent,
    AmrrTypeaheadMultiselectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    ApiBusinessService,
    AmrrLoadingDialogService,
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
