import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import { map, Observable, startWith, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { optionsMap, Team } from 'src/app/types/api';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  
  @ViewChild('topTeamInput') topTeamInput:ElementRef<HTMLInputElement> | undefined
  @ViewChild('botTeamInput') botTeamInput:ElementRef<HTMLInputElement> | undefined
  constructor(
    private apiService: ApiService,
  ) {
    this.teamControl.disable()
    this.groupControl.disable()
    }

  teamControl = new FormControl<string | Team >("")
  groupControl = new FormControl<string | Team >("")
  topTeamCtrl = new FormControl('');
  botTeamCtrl = new FormControl('');
  

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedLeague = ""
  selectedSeason = (new Date().getFullYear()).toString()
  selectedTeam = ""
  selectedGroup =""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];
  groups: optionsMap[] = [];
  weekMatchInit = []
  weekMatchLast = []
  selectedWMI = 0
  selectedWML = 0

  
  teamsAuto: Observable<Team[]> | undefined;
  groupsAuto: Observable<Team[]> | undefined;
  teamsTopAuto: Observable<string[]> |undefined
  selectedTopTeams : string[]=[]
  teamsBotAuto: Observable<string[]> |undefined
  selectedBotTeams : string[]=[]

  ngOnInit(): void {
    this.getLeagues()
    if (history.state.data) {
      this.selectedLeague =history.state.data.league
      this.getSeasonsByLeague(this.selectedLeague)
      this.getTeamsGroups(this.selectedSeason, this.selectedLeague)
    }
    else{
     
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
    })
  }

  private getTeamsGroups(year: string, league: string){
    this.apiService.getAllTeamsByLeagueYear(year, league).subscribe(data => {
      console.log(data)
      for (let i= 0; i< data.length; ++i){
        for(let j = 0; j<data[i].length; ++j){
          
          this.teams.push({'index': data[i][j][1], 'value': data[i][j][2]})
        }
        this.groups.push({'index': data[i][0][0], 'value': data[i][0][1]})
      }
      


      let teamsAux: Team[] = this.teams.map((value: any) => {
          return {team: value.value}
      })
       

      let groupsAux: Team[] = this.groups.map((value: any) => {
        return {team: value.value}
      })
      
      this.teamControl.enable()
      this.groupControl.enable()
      this.getWeekMatch()

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
    
      this.teamsTopAuto = this.topTeamCtrl.valueChanges.pipe(
        startWith(null),
        map( (team: string|null) => (team ? this._filterTopTeam(team): this.teams.map(t => {return t.value}).slice())))
      
        this.teamsBotAuto = this.botTeamCtrl.valueChanges.pipe(
          startWith(null),
          map( (team: string|null) => (team ? this._filterBotTeam(team): this.teams.map(t => {return t.value}).slice())))
      })
  }

  private getWeekMatch(){
    if(this.selectedGroup){
      let codeLeague = this.groups.find(test => test.value==this.selectedGroup)
      if(codeLeague){
        this.apiService.getWeekMatchByCode(codeLeague.index).subscribe(data =>{
          this.weekMatchInit= data
        })
      }

    }
  }


  changeLeague(league: string){
    this.resetAll()
    this.getSeasonsByLeague(league);
    this.getTeamsGroups(this.selectedSeason.substring(0,4), league)
  }
  changeSeason(season: string){
    this.resetAll()
    this.getTeamsGroups(season, this.selectedLeague)
  }

  
  
  groupSelected(group: any){

      let teamsOfGroup = this.teams.filter(team => team.index == group.value.toString())
      
      console.log(!teamsOfGroup.find(team => team.value == this.selectedTeam))
      if(!teamsOfGroup.find(team => team.value == this.selectedTeam)) this.resetTeams()

      
      let teamAux :Team[] = teamsOfGroup.map((value: any) => {
        return {team: value.value}
      })
      this.teamsAuto = this.teamControl.valueChanges.pipe(
        startWith(""),
        map(value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterTeamsByGroup(teamAux, name) : teamAux.slice();
        })
      )
  }

  teamSelected(team: any){
    console.log(typeof team.team)
    console.log(this.teams)

    let find = this.teams.find(team1 => team1.value== team.team)
    if (find) this.selectedGroup= find.index
    console.log(this.selectedGroup)
  }





















  displayFn(text: Team): string {
    return text && text.team ? text.team : '';
  }
  private _filterTeams(options: Team[], value: string){
    if(this.teamsAuto) return options.filter((team: { team: string; }) => team.team.toLowerCase().includes(value.toLowerCase()))
    return []
  }

  private _filterTeamsByGroup(teams: any[], value: any){
    if(this.teamsAuto) return teams.filter(team => team.team.toLowerCase().includes(value.toLowerCase()))
    return []
  }

  private _filterGroups(options: Team[], value: string){
    const filterValue = value.toLowerCase();

    if(this.groupsAuto) return options.filter((group: { team: string; }) => group.team.toLowerCase().includes(filterValue))
    return []
  }
  
  private _filterTopTeam(value: string) {
    let options = this.teams.map(value => {return value.value})
    const filterValue = value.toLowerCase();
    return options.filter(team => team.toLowerCase().includes(filterValue) ) //&& !this.selectedTopTeams.includes(team)
  }

  addTop(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();


    // Add our fruit
    if (value && this.teams.map(t=> {return t.value}).includes(value)) {
      this.selectedTopTeams.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.topTeamCtrl.setValue(null);
  }
  removeTop(team: string): void {
    const index = this.selectedTopTeams.indexOf(team);
    
    if (index >= 0) {
      this.selectedTopTeams.splice(index, 1);
    }
  }
  selectedTop(event: MatAutocompleteSelectedEvent): void {

    if (!this.selectedTopTeams.includes(event.option.viewValue)) {
      this.selectedTopTeams.push(event.option.viewValue);
    }
    if(this.topTeamInput) this.topTeamInput.nativeElement.value = '';
    this.topTeamCtrl.setValue(null);
  }


  private _filterBotTeam(value: string) {
    let options = this.teams.map(value => {return value.value})
    const filterValue = value.toLowerCase();
    return options.filter(team => team.toLowerCase().includes(filterValue) ) //&& !this.selectedBotTeams.includes(team)
  }

  addBot(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();


    // Add our fruit
    if (value && this.teams.map(t=> {return t.value}).includes(value)) {
      this.selectedBotTeams.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.topTeamCtrl.setValue(null);
  }

  removeBot(team: string): void {
    const index = this.selectedBotTeams.indexOf(team);
    
    if (index >= 0) {
      this.selectedBotTeams.splice(index, 1);
    }
  }
  selectedBot(event: MatAutocompleteSelectedEvent): void {

    if (!this.selectedBotTeams.includes(event.option.viewValue)) {
      this.selectedBotTeams.push(event.option.viewValue);
    }
    if(this.botTeamInput) this.botTeamInput.nativeElement.value = '';
    this.botTeamCtrl.setValue(null);
  }



  private resetAll(){
    this.resetGroup()
    this.resetTeams()
  }

  private resetGroup(){
    this.groupControl.reset()
    this.selectedGroup=""
    this.groups = []
  }

  private resetTeams(){
    this.teamControl.reset()
    this.selectedTeam=""
    this.teams = []
    this.resetTop()
    this.resetBottom()
  }

  private resetTop(){
    this.topTeamCtrl.reset()
    this.selectedTopTeams = []
  }

  private resetBottom(){
    this.botTeamCtrl.reset()
    this.selectedBotTeams = []
  }

}
