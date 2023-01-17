import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/types/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  langs: Language[]
  selectedLang: Language | undefined;

  constructor(public translate: TranslateService) { 
    this.setAppLanguage()
    this.langs=[
      {name:"Esp", code:'es',flag:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Spanish_language_%28ES-MX%29.svg/45px-Flag_of_Spanish_language_%28ES-MX%29.svg.png"},
      {name:"Eng", code:'en', flag:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/English_language.svg/45px-English_language.svg.png"}
    ]
    this.selectedLang = this.langs[1]

  }

  ngOnInit(): void {
  }

  changeLang(value: any){
    console.log(value)
    this.selectedLang = value
    this.translate.use(value.code)
  }
  setAppLanguage(){
    this.translate.currentLang = 'en'
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.currentLang)
  }


}
