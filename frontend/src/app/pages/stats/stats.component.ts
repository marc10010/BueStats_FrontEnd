import { ChangeDetectorRef, Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from 'src/environments/environment';
import { map, Observable, startWith, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { optionsMap, Team } from 'src/app/types/api';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from "@angular/platform-browser";
import {  MatSnackBar,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import { DialogContentErrors } from 'src/app/dialogs/dialog-content-error';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  
  @ViewChild('topTeamInput') topTeamInput:ElementRef<HTMLInputElement> | undefined
  @ViewChild('botTeamInput') botTeamInput:ElementRef<HTMLInputElement> | undefined
  @ViewChild('myiFrame') myframe:ElementRef<HTMLIFrameElement> |undefined ;
  
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cdref: ChangeDetectorRef,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    this.teamControl.disable()
    this.teamRivalControl.disable()
    this.groupControl.disable()
    }

  teamControl = new FormControl<string | Team >("")
  teamRivalControl = new FormControl<string | Team >("")
  groupControl = new FormControl<string | Team >("")
  topTeamCtrl = new FormControl('');
  botTeamCtrl = new FormControl('');
  

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedLeague = ""
  selectedSeason = ""
  selectedTeam = ""
  selectedTeamRival = ""
  selectedGroup =""
  leagues: optionsMap[] = [];
  seasons: optionsMap[] = [];
  teams: optionsMap[] = [];
  teamsRival: optionsMap[] = [];
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
  streamlitRival = ''
  streamlitLeague = ""
  cargaCompleta = 0
  loading:Boolean = false
  msg_loading = this.translate.instant('stats.msg_loading1')


  
  teamsAuto: Observable<Team[]> | undefined;
  teamsAutoRival: Observable<Team[]> | undefined;
  groupsAuto: Observable<Team[]> | undefined;
  teamsTopAuto: Observable<string[]> |undefined
  selectedTopTeams : string[]=[]
  teamsBotAuto: Observable<string[]> |undefined
  selectedBotTeams : string[]=[]
  teamsAutoSelect: Observable<string[]> |undefined


  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  getSource_sanitize = this.getSource()

  ngOnInit(): void {
    if('https:' == window.location.protocol) this.openSnackBar("Estas accediendo a esta web con 'HTTPS', Para ver la información deberas acceder a traves de 'http://buestats.redirectme.net'")

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
    this.loading = true
    this.msg_loading=this.translate.instant('stats.msg_loading2')
    
    this.apiService.getAllTeamsByLeagueYear(year, league).subscribe(data => {
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
      this.teamRivalControl.enable()
      this.groupControl.enable()
      this.loading = false
    
      //this.getWeekMatch()

      this.teamsAuto = this.teamControl.valueChanges.pipe(
        startWith(""),
        map( value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterTeams(teamsAux as Team[], name as string) : teamsAux.slice();
        })
      )
      this.teamsAutoRival = this.teamRivalControl.valueChanges.pipe(
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
    /*
      this.teamsTopAuto = this.topTeamCtrl.valueChanges.pipe(
        startWith(null),
        map( (team: string|null) => (this.filterNonUsed().slice())))
      
      this.teamsBotAuto = this.botTeamCtrl.valueChanges.pipe(
          startWith(null),
          map( (team: string|null) => (this.filterNonUsed().slice())))
    */
      })
  }

  private getWeekMatch(){
    ////console.log("week match", this.selectedGroup, this.selectedSeason, this.selectedLeague)
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
    this.resetGroup()
    this.resetTeams()
    this.getTeamsGroups(season, this.selectedLeague)
  }

  
  group_selected = ""
  groupSelected(group: any){
      this.group_selected=group
      //console.log(this.teams)
      this.selectedTeam=""
      this.selectedTeamRival=""
      this.teamControl.reset()
      this.teamRivalControl.reset()
      this.resetWeeks()
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

      this.teamsAutoRival = this.teamRivalControl.valueChanges.pipe(
        startWith(""),
        map(value=>{
          const name = typeof value === 'string' ? value : value?.team;
          return name ? this._filterTeams(teamAux as Team[], name as string) : teamAux.slice();
        })
      )
      this.teamRivalControl.enable()
      //this.getWeekMatch()
  }

  teamSelected(team: any){
    this.selectedTeam=team.team
    let find = this.teams.find(team1 => team1.value== team.team)
    if (find) this.selectedGroup= find.index
    
    let teamsOfGroup = this.teams.filter(team => team.index == this.selectedGroup)
    
      
    let teamsAux :Team[] = teamsOfGroup.map((value: any) => {
        return {team: value.value}
      })

    
    this.teamsAutoRival = this.teamRivalControl.valueChanges.pipe(
      startWith(""),
      map( value=>{
        const name = typeof value === 'string' ? value : value?.team;
        return name ? this._filterTeams(teamsAux as Team[], name as string) : teamsAux.slice();
      })
    )
    
    this.getWeekMatch()
    ////console.log(this.weekMatchInit)
  }

  teamRivalSelected(team: any){
    this.selectedTeamRival=team.team

    
    let find = this.teamsRival.find(team1 => team1.value== team.team)
    if (find) this.selectedGroup= find.index
  }

  extractStats(){
    if (this.selectedWMI > this.selectedWML){
      this.dialog.open(DialogContentErrors, {
        data: {title: this.translate.instant("stats.alert"), msg: this.translate.instant("stats.alert_msg")},
      });
    }
    else{
      this.hide_iframe()
      this.cargaCompleta =1
      this.hasTeam= false 
      if(this.selectedTeamRival==""){
        this.selectedTeamRival = this.teams.filter(team => team.index == this.selectedGroup)[0].value
        
        if (this.selectedTeamRival == this.selectedTeam) this.selectedTeamRival = this.teams.filter(team => team.index == this.selectedGroup)[1].value
        
      }
      this.loading=true
      this.msg_loading=this.translate.instant('stats.msg_loading3')
      this.apiService.createCsv(this.selectedLeague, this.selectedSeason, this.selectedGroup, this.selectedTeam, this.selectedWMI, this.selectedWML, this.extractAllWeeks, this.extractStatsTeam, this.extractRanking, this.selectedTeamRival).subscribe(data =>{            
        this.streamlitTeam = data[0]
        this.streamlitRival = data[1]
        this.streamlitLeague= data[2]
        this.cargaCompleta = 2
        this.loading = false
        this.getSource()
      },
      error=>{
        this.cargaCompleta=0
        this.loading =false
        if(error.status ==404){
          this.dialog.open(DialogContentErrors, {
          data: {title: this.translate.instant('stats.error_title3'), msg: this.translate.instant('stats.error_msg2')},
          });
        }
        if(error.status ==500) {
          this.dialog.open(DialogContentErrors, {
            data: {title: this.translate.instant('stats.error_title2'), msg: this.translate.instant('stats.error_msg2')},
            });
        }
      })
    }
  }


  

  openDialog(msg_title:string, msg:string): void {
    this.dialog.open(DialogContentErrors, {
      data: {title: msg_title, animal: msg},
    });
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
    //console.log('filterNonUsed')
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
    this.resetYears()
    this.resetGroup()
    this.resetTeams()
  }

  private resetYears(){
    this.selectedSeason = ''
  }

  private hide_iframe(){
    this.loading=false;
    this.cargaCompleta=0;
  }

  private resetGroup(){
    this.groupControl.reset()
    this.selectedGroup=""
    this.groups = []
  }

  private resetTeams(){
    this.teamControl.reset()
    this.teamRivalControl.reset()
    this.selectedTeam=""
    this.selectedTeamRival=""
    this.teamsAuto = undefined 
    this.teamControl.disable()
    this.teamRivalControl.disable()
    this.teamsAuto = undefined
    this.teamsAutoRival = undefined
    this.teams = []
    this.resetWeeks()
    this.resetTop()
    this.resetBottom()
  }
  private resetWeeks(){
    this.weekMatchLast=[]
    this.weekMatchInit=[]
    this.selectedWMI = 0
    this.selectedWML = 0  
    
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
    let url = environment.streamlit +"?team_searched=" + this.streamlitTeam.toUpperCase()+"&rival_searched="+this.streamlitRival.toUpperCase()+"&league_searched="+this.streamlitLeague.toUpperCase()
    console.log(url)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

  


  openSnackBar(msg: string, horizontal=this.horizontalPosition, vertical=this.verticalPosition) {
    this._snackBar.open(msg, 'Cerrar', {
      horizontalPosition: horizontal,
      verticalPosition: vertical,
    });
  }

}


