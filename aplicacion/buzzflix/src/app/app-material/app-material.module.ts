import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule
  ]
})
export class AppMaterialModule { }
