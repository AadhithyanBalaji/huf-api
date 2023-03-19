import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable()
export class ApiBusinessService {
  constructor(private readonly httpClient: HttpClient) {}

  get(endpoint: string) {
    return this.httpClient.get(`${this.getBaseUrl()}/api/v1/${endpoint}`);
  }

  getById(endpoint: string, id: number) {
    return this.httpClient.get(`${this.getBaseUrl()}/api/v1/${endpoint}/${id}`);
  }

  post(endpoint: string, requestBody: any) {
    return this.httpClient.post(
      `${this.getBaseUrl()}/api/v1/${endpoint}`,
      requestBody
    );
  }

  put(endpoint: string, requestBody: any) {
    return this.httpClient.put(
      `${this.getBaseUrl()}/api/v1/${endpoint}`,
      requestBody
    );
  }

  delete(endpoint: string, id: number) {
    return this.httpClient.delete(
      `${this.getBaseUrl()}/api/v1/${endpoint}/${id}`
    );
  }

  private getBaseUrl() {
    const isDev = false;
    return isDev
      ? 'http://localhost:3000'
      : 'https://amrr-api.azurewebsites.net';
  }
}
