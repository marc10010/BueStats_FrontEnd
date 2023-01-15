import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {  MatSnackBar,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router,
  ) { }

  infoLeague = []

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  ngOnInit(): void {
    if('https:' == window.location.protocol) this.openSnackBar()
    this.apiService.getBasicInfoLeagues().subscribe(data => {
      this.infoLeague=data
    })
  }

  stats(league: string){
    this.router.navigate(['/stats'], {state: {data:{league}}})
  }

  openSnackBar() {
    this._snackBar.open("Estas accediendo a esta web con 'HTTPS', Para ver la información deberas acceder a traves de 'HTTP' "+ 'http://buestats.redirectme.net', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
