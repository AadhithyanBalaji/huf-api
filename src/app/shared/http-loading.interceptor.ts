import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AmrrLoadingDialogService } from './amrr-loading/amrr-loading-dialog.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(
    private readonly loadingDialogService: AmrrLoadingDialogService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingDialogService.showLoading();
    return next.handle(request).pipe(
      finalize(() => {
        this.loadingDialogService.hideLoading();
      })
    ) as Observable<HttpEvent<any>>;
  }
}
