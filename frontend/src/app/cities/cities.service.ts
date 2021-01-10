import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { City } from './city.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CitiesService {

  constructor(private http: HttpClient) {}

  findCities(pageNumber: number, pageSize: number): Observable<City[]> {

    return this.http.get('http://localhost:1111/cities/queryByPage', {
      params: new HttpParams()
        .set('page', pageNumber.toString())
        .set('size', pageSize.toString())
    }).pipe(
      map(res =>  res["content"])
    );
  }

  findNumberCities(): Observable<number> {
    return this.http.get('http://localhost:1111/cities/queryByPage', {
      params: new HttpParams()
        .set('page', '0')
        .set('size', '5')
    }).pipe(
      map(res =>  res["totalElements"])
    );
  }
}
