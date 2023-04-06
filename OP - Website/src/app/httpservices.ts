import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from './global-component';


const headersOpt = new HttpHeaders()
  .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  .set('Access-Control-Allow-Origin', '*')
  .set('Authorization', 'Bearer ' + sessionStorage['AccessToken'] ? sessionStorage.getItem('AccessToken') : "");

var header = new HttpHeaders({
  'Content-Type': 'application/json',
  // 'Authorization': 'Bearer '+sessionStorage['AccessToken'] ? sessionStorage.getItem('AccessToken'):""
})


@Injectable({
  providedIn: 'root',
})

export class ApiHttpService {
  constructor(
    // Angular Modules 
    private http: HttpClient
  ) { }

  public get(url: string, options?: any) 
  {
    if (localStorage['AccessToken'] && !header.has('AccessToken')) 
    {
      header = header.set('Authorization', 'Bearer ' + localStorage['AccessToken']);
    }
    return this.http.get(GlobalComponent.apiUrl + url, { headers: header });
  }
  public post(url: string, data: any, options?: any) 
  {
    if (localStorage['AccessToken'] && !header.has('AccessToken')) {
      header = header.set('Authorization', 'Bearer ' + localStorage['AccessToken']);
    }
    return this.http.post(GlobalComponent.apiUrl + url, data, { headers: header });
  }
  public put(url: string, data: any, options?: any) 
  {
    if (localStorage['AccessToken'] && !header.has('AccessToken')) {
      header = header.set('Authorization', 'Bearer ' + localStorage['AccessToken']);
    }
    return this.http.put(GlobalComponent.apiUrl + url, data, { headers: header });
  }
  public delete(url: string, options?: any) 
  {
    if (localStorage['AccessToken'] && !header.has('AccessToken')) {
      header = header.set('Authorization', 'Bearer ' + localStorage['AccessToken']);
    }
    return this.http.delete(GlobalComponent.apiUrl + url, { headers: header });
  }
}