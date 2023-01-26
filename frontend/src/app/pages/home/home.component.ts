import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {  MatSnackBar,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(
    private translate: TranslateService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router,
  ) { 
    this.setAppLanguage()
  }

  infoLeague = []

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  ngOnInit(): void {
    this.apiService.getBasicInfoLeagues().subscribe(data => {
      this.infoLeague=data
    })
  }

  stats(league: string){
    this.router.navigate(['/stats'], {state: {data:{league}}})
  }

  

  setAppLanguage(){
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.currentLang)
  }

}
