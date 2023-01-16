import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import {DialogModule} from '@angular/cdk/dialog';






const modulosMaterial = [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    DialogModule
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
  