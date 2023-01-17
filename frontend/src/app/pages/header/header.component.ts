import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private translate: TranslateService,
  ) { 
    this.setAppLanguage()

  }

  ngOnInit(): void {
  }

  changeLanguage(){
    this.translate.use('es')
  }
  
  setAppLanguage(){
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.currentLang)
  }

}
