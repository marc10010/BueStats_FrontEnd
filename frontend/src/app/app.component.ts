import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'BueStats';

  /*
  constructor(
    private apiService: ApiService,
  ){}
  
  seasons: optionsMap[] = [];

  public callAPI(liga: string){
    this.apiService.getSeasonsByLegue(liga).subscribe(data => {
      console.log(data)
      this.seasons = data.map((season: string) => ({index: season.substring(0,4), value: season}))
      console.log(this.seasons)      
    })
  }
  */


}