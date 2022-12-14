import { ChangeDetectorRef, Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import { map, Observable, startWith, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { optionsMap, Team } from 'src/app/types/api';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from "@angular/platform-browser"; 


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  
  @ViewChild('topTeamInput') topTeamInput:ElementRef<HTMLInputElement> | undefined
  @ViewChild('botTeamInput') botTeamInput:ElementRef<HTMLInputElement> | undefined
  @ViewChild('myiFrame') myframe:ElementRef<HTMLIFrameElement> |undefined ;
  constructor(
    private cdref: ChangeDetectorRef,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
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
  selectedSeason = ""
  selectedTeam = ""
  selectedGroup =""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];
  teamsNotUsed: string[] = [];
  groups: optionsMap[] = [];
  weekMatchInit = []
  weekMatchLast = []
  selectedWMI = 0
  selectedWML = 0
  extractAllWeeks: Boolean = true
  extractStatsTeam: Boolean = true
  extractRanking: Boolean = true
  hasTeam: Boolean = false
  streamlitTeam = ""
  streamlitLeague = ""
  cargaCompleta = 0

  
  teamsAuto: Observable<Team[]> | undefined;
  groupsAuto: Observable<Team[]> | undefined;
  teamsTopAuto: Observable<string[]> |undefined
  selectedTopTeams : string[]=[]
  teamsBotAuto: Observable<string[]> |undefined
  selectedBotTeams : string[]=[]
  teamsAutoSelect: Observable<string[]> |undefined

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
    this.seasons=[]
    this.apiService.getSeasonsByLegue(league).subscribe(data => {
      this.seasons = data.map((season: string) => ({index: season.substring(0,4), value: season}))
      
    })
  }

  private getTeamsGroups(year: string, league: string){
    this.teams= []
    this.groups=[]
    this.apiService.getAllTeamsByLeagueYear(year, league).subscribe(data => {
      for (let i= 0; i< data.length; ++i){
        for(let j = 0; j<data[i].length; ++j){
          
          this.teams.push({'index': data[i][j][1], 'value': data[i][j][2]})
        }
        this.groups.push({'index': data[i][0][0], 'value': data[i][0][1]})
      }

      console.log(this.teams)
      console.log(this.groups)
      


      let teamsAux: Team[] = this.teams.map((value: any) => {
          return {team: value.value}
      })
       

      let groupsAux: Team[] = this.groups.map((value: any) => {
        return {team: value.value}
      })
      
      this.teamControl.enable()
      this.groupControl.enable()
      //this.getWeekMatch()

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
        map( (team: string|null) => (this.filterNonUsed().slice())))
      
      this.teamsBotAuto = this.botTeamCtrl.valueChanges.pipe(
          startWith(null),
          map( (team: string|null) => (this.filterNonUsed().slice())))
      })
  }

  private getWeekMatch(){
    console.log("week match", this.selectedGroup, this.selectedSeason, this.selectedLeague)
    this.weekMatchInit=[]
    if(this.selectedGroup){
        this.apiService.getWeekMatchByCode(this.selectedSeason, this.selectedLeague).subscribe(data =>{
          this.weekMatchInit= data
          this.selectedWMI = this.weekMatchInit[0]
          this.selectedWML = this.weekMatchInit[data.length -1]  
        })
    }
  }


  changeLeague(league: string){
    this.resetAll()
    this.getSeasonsByLeague(league);
    //this.getTeamsGroups(this.selectedSeason.substring(0,4), league)
  }
  changeSeason(season: string){
    this.resetAll()
    this.getTeamsGroups(season, this.selectedLeague)
  }

  
  
  groupSelected(group: any){

      console.log(this.teams)
      this.selectedTeam=""
      this.teamControl.reset()
      this.selectedWMI = 0
      this.selectedWML = 0
      let teamsOfGroup = this.teams.filter(team => team.index == group.value.toString())
    
      
      let teamAux :Team[] = teamsOfGroup.map((value: any) => {
        return {team: value.value}
      })
    
      this.teamsAuto = this.teamControl.valueChanges.pipe(
        startWith(""),
        map(value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterTeams(teamAux as Team[], name as string) : teamAux.slice();
        })
      )
      this.teamControl.enable()
      //this.getWeekMatch()
  }

  teamSelected(team: any){
    this.selectedTeam=team.team

    
    let find = this.teams.find(team1 => team1.value== team.team)
    if (find) this.selectedGroup= find.index
    this.getWeekMatch()
    console.log(this.weekMatchInit)
  }

  extractStats(){
    if (this.selectedWMI > this.selectedWML){
      alert("jornada incial >= jornada final")
    }
    else{
      this.streamlitTeam=''
      this.streamlitLeague=''
      this.cargaCompleta =1
      this.hasTeam= false 
    
      this.apiService.createCsv(this.selectedLeague, this.selectedSeason, this.selectedGroup, this.selectedTeam, this.selectedWMI, this.selectedWML, this.extractAllWeeks, this.extractStatsTeam, this.extractRanking).subscribe(data =>{            
        this.streamlitTeam= data
        this.apiService.createCsv(this.selectedLeague, this.selectedSeason, this.selectedGroup, 'LIGA', this.selectedWMI, this.selectedWML, this.extractAllWeeks, this.extractStatsTeam, this.extractRanking).subscribe(data =>{            
          this.streamlitLeague= data
          this.cargaCompleta =2
          this.cdref.detectChanges()
        })
      })
    }
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
    console.log("filter ", options)
    console.log("filter value", value)
    console.log("filter selectedTop", this.selectedTopTeams)
    console.log("bool: ", this.selectedTopTeams.includes(value))
    const filterValue = value.toLowerCase();
    return options.filter(team => team.toLowerCase().includes(filterValue) && !this.selectedTopTeams.includes(team) ) //&& !this.selectedTopTeams.includes(team)
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

  private filterNonUsed(){
    console.log('filterNonUsed')
    let options = this.teams.map(value => {return value.value})
    return options.filter(team => !(this.selectedBotTeams.includes(team)) && !(this.selectedTopTeams.includes(team)) && team != this.selectedTeam) 
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
    this.teamsAuto = undefined 
    this.teamControl.disable()
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

  getSource() {
    let url = "http://buestats.redirectme.net:8502/?team_searched=" + this.streamlitTeam.toUpperCase()+"&league_searched="+this.streamlitLeague.toUpperCase()
    console.log(url)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
