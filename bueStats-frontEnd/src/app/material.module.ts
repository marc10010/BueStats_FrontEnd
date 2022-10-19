import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const modulosMaterial = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  MatNativeDateModule,
  MatTableModule,
  MatSidenavModule,
  MatSelectModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modulosMaterial
  ],
  exports: [
    modulosMaterial
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ]
})
export class MaterialModule { }
