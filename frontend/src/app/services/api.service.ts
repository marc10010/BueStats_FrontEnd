import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../types/api';
import { map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
  })
export class ApiService{
  private corsHeaders: HttpHeaders;

    constructor (
        private http: HttpClient
    ){
      this.corsHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      //this.contents = '';
    }

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
        return this.http.get<any>(environment.apiUrl + environment.getSeasons + "?league=" +league, {headers: this.corsHeaders})
    }

    getBasicInfoLeagues(){
      return this.http.get<any>(environment.apiUrl + environment.getBasicInfo, {headers: this.corsHeaders})
    }

    getAllTeamsByLeagueYear(year: string, league: string){
      return this.http.get<any>(environment.apiUrl + environment.getAllTeams+"?league=" +league +"&year=" + year, {headers: this.corsHeaders})
    }

    getWeekMatchByCode(code: string){
      return this.http.get<any>(environment.apiUrl + environment.getWeeksMatch +'?code='+code, {headers: this.corsHeaders})
    }
}