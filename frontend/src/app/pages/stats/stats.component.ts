import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { optionsMap } from 'src/app/types/api';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
  ) { }

  selectedLeague = ""
  selectedSeason = (new Date().getFullYear() -1).toString()
  selectedTeam = ""
  selectedGroup =""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];
  groups: optionsMap[] = [];

  ngOnInit(): void {
    this.getLeagues()
    if (history.state.data) {
      this.selectedLeague =history.state.data.league
      this.getSeasonsByLeague(this.selectedLeague)
      this.getTeams(this.selectedSeason, this.selectedLeague)
    }
  }

  private getLeagues(){
    this.apiService.getBasicInfoLeagues().subscribe(data => {
      this.leagues=data.map((league: string) => ({index: league[1], value: league[0]}))
    })
  }
  
  private getSeasonsByLeague(league: string){
    this.apiService.getSeasonsByLegue(league).subscribe(data => {
      this.seasons = data.map((season: string) => ({index: season.substring(0,4), value: season}))
      console.log(this.seasons)
    })
  }

  private getTeams(year: string, league: string){
    this.apiService.getAllTeamsByLeagueYear(year, league).subscribe(data => {
      for (let i= 0; i< data.length; ++i){
        for(let j = 0; j<data[i].length; ++j){
          if (!this.teams.some(e=> e.value === data[i][j][2])) this.teams.push({'index': data[i][j][2], 'value': data[i][j][2]})
          if (!this.groups.some(e=> e.value === data[i][j][1])) this.groups.push({'index': data[i][j][1], 'value': data[i][j][1]})
        }
      }
      console.log(this.teams)
      
    })
  }

  changeLeague(league: string){
    this.getSeasonsByLeague(league);
  }

}
