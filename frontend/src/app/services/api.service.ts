import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../types/api';
import { map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
  })
export class ApiService{
  removeAccents = require("remove-accents")
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
      return this.http.get<any>(environment.apiUrl + environment.getAllTeams+"?league=" +this.removeAccents(league) +"&year=" + year, {headers: this.corsHeaders})
    }

    getWeekMatchByCode(year: string, league: string){
      return this.http.get<any>(environment.apiUrl + environment.getWeeksMatch +"?league=" +this.removeAccents(league) +"&year=" + year, {headers: this.corsHeaders})
    }

    createCsv(league: string, season: string, group: string, team: string, first: number, last:number, extractAllWeeks: Boolean, extractStats:Boolean, extractRanking: Boolean, teamRival: string){
      league = this.removeAccents(league)
      season = this.removeAccents(season)
      group = this.removeAccents(group)
      group = group.replace("Liga Regular ","").replace('"', "").replace('"', "").replace("-", "")
      team = this.removeAccents(team)
      team = team.replace("Ç", "C")
      teamRival = this.removeAccents(teamRival)
      teamRival = teamRival.replace("Ç", "C")
      const body ={league: league, season: season, group: group, team: team, first: first, last: last, extractAllWeeks: extractAllWeeks, extractStats: extractStats, extractRanking: extractRanking, teamRival: teamRival}
      console.log(body)
      return this.http.post<any>(environment.apiUrl + environment.createCsv, body, {headers: this.corsHeaders} )
    }
}


