import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Data } from '@angular/router';
import { map, Observable, startWith, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { optionsMap, Team } from 'src/app/types/api';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  
  constructor(
    private apiService: ApiService,
  ) { }

  teamControl = new FormControl<string | Team >("")
  groupControl = new FormControl<string | Team >("")
  selectedLeague = ""
  selectedSeason = (new Date().getFullYear()).toString()
  selectedTeam = ""
  selectedGroup =""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];
  groups: optionsMap[] = [];

  teamsAuto: Observable<Team[]> | undefined;
  groupsAuto: Observable<Team[]> | undefined;
  
  ngOnInit(): void {
    this.getLeagues()
    if (history.state.data) {
      this.selectedLeague =history.state.data.league
      this.getSeasonsByLeague(this.selectedLeague)
      this.getTeams(this.selectedSeason, this.selectedLeague)
    }
    else{
      this.teamControl.disable()
      this.groupControl.disable()
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
      console.log(data)
      for (let i= 0; i< data.length; ++i){
        for(let j = 0; j<data[i].length; ++j){
          
          this.teams.push({'index': data[i][j][1], 'value': data[i][j][2]})
          if(!this.groups.find(x => x.index == data[i][j][0] )) this.groups.push({'index': data[i][j][0], 'value': data[i][j][1]})
          
        }
      }
      let teamsAux: Team[] = data[0].map((value: any) => {
        return {team: value[2]}
      })

      let groupsAux: Team[] = this.groups.map((value: any) => {
        console.log(value)
        return {team: value.value}
      })
      console.log(teamsAux)
      console.log(groupsAux)
      
      this.teamsAuto = this.teamControl.valueChanges.pipe(
        startWith(""),
        map( value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterTeams(teamsAux as Team[], name as string) : teamsAux.slice();
        })
      )

      this.groupsAuto = this.groupControl.valueChanges.pipe(
        startWith(""),
        map( value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterGroups(groupsAux as Team[], name as string) : groupsAux.slice();
        })
      )
      
      
      
    })
  }

  changeLeague(league: string){
    this.getSeasonsByLeague(league);
  }


  displayFn(text: Team): string {
    return text && text.team ? text.team : '';
  }
  private _filterTeams(options: Team[], value: string){
    const filterValue = value.toLowerCase();

    if(this.teamsAuto) return options.filter((team: { team: string; }) => team.team.toLowerCase().includes(filterValue))
    return []
  }

  private _filterGroups(options: Team[], value: string){
    const filterValue = value.toLowerCase();

    if(this.groupsAuto) return options.filter((group: { team: string; }) => group.team.toLowerCase().includes(filterValue))
    return []
  }

}
