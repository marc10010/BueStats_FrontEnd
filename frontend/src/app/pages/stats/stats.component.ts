import { Component, OnInit } from '@angular/core';
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
  selectedSeason = new Date().getFullYear().toString()
  selectedTeam = ""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];

  ngOnInit(): void {
    this.getLeagues()
    if (history.state.data) {
      this.selectedLeague =history.state.data.league
      this.getSeasonsByLeague(this.selectedLeague)
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

  private getTeams(){

  }

  changeLeague(league: string){
    this.getSeasonsByLeague(league);
  }

}
