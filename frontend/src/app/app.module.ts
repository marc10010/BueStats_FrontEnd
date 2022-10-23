import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { StatsComponent } from './pages/stats/stats.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    StatsComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
