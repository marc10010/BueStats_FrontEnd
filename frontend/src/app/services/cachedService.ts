import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CachedService {
  
    private codeLang = new Subject<string>();
    sendChangeLangEvent(code: string) {
      this.codeLang.next(code);
    }
    getChangeLangEvent(): Observable<any>{ 
      return this.codeLang.asObservable();
    }
}
  