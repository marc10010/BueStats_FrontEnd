import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  infoLeague = []


  ngOnInit(): void {
    this.apiService.getBasicInfoLeagues().subscribe(data => {
      this.infoLeague=data
    })
  }

  stats(league: string){
    this.router.navigate(['/stats'], {state: {data:{league}}})
  }

}
