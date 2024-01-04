import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { Province } from '../common/province';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private provincesUrl = 'http://localhost:8080/api/provinces';

  // Injecting the httpClient because we are going to do some REST calls
  constructor(private httpCLients: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpCLients.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getProvinces(countryCode: string): Observable<Province[]>{

    const searchProvinceUrl = `${this.provincesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpCLients.get<GetResponseProvinces>(searchProvinceUrl).pipe(
      map(response => response._embedded.provinces)
    );
  }

  getCreditCardMonths(startMoth: number): Observable<number[]> {

    let data: number[] = [];

    // Building an array for "Month" dropdown list
    // - start at current month and loop until end of the year

    for (let month = startMoth; month <= 12; month++) {
      data.push(month);
    }

    // The 'of' operator from rxjs, will wrap an object as an observable
    return of(data);
  }

  /**
   * 
   * @param yearsRange : How many years want to be displayed default 10
   * @returns : An array of years from current year until yearsRange
   */
  getCreditCardYears(yearsRange: number = 10): Observable<number[]> {

    let data: number[] = [];

    // Building an array for "Year" dropdown list
    // - start at current year and return the next "yearsRange"
    const starYear: number = new Date().getFullYear();
    const endYear: number = starYear + yearsRange;

    for (let year = starYear; year <= endYear; year++) {
      data.push(year);
    }

    // The 'of' operator from rxjs, will wrap an object as an observable
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseProvinces {
  _embedded: {
    provinces: Province[];
  }
}