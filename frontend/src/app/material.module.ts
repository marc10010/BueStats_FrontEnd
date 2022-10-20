import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


const modulosMaterial = [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,

]

@NgModule({
    declarations: [],
    imports: [
      modulosMaterial
    ],
    exports: [
      modulosMaterial
    ]
  })
  export class MaterialModule { }
  