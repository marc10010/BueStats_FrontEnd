import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../types/api';
import { map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
  })
export class ApiService{

    constructor (
        private http: HttpClient
    ){}

    private mapResponseConvertFieldsToString(response: ApiResponse<any[]>, fieldsToConvertFromNumberToString: string[]) {
        return ({
          ...response, response: response.response.map((oferta: any) => {
            const obj = {
              ...oferta,
            }
            fieldsToConvertFromNumberToString.forEach(field => {
              if ((obj[field] === 0 || obj[field]) && !isNaN(obj[field])) {
                obj[field] = obj[field].toString();
              }
            });
            return obj;
          })
        })
      }

    getSeasonsByLegue(league: string){
        const year = '2021';
        const html_doc = environment.htmlCalendar;
        const body = JSON.stringify({ html_doc, league, year})
        console.log(body)
        return this.http.get<any>(environment.apiUrl + environment.getSeasonsByLeague + "?league=" +league)
    }
}