import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { optionsMap } from './types/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'frontend';

  constructor(
    private apiService: ApiService,
  ){}
  
  seasons: optionsMap[] = [];

  public callAPI(liga: string){
    this.apiService.getSeasonsByLegue(liga).subscribe(data => {
      this.seasons = data.map((season: string) => ({index: season.substr(0,4), value: season}))
      console.log(this.seasons)      
    })
  }


}