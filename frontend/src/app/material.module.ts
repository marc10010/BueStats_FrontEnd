import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


const modulosMaterial = [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
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
  