import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";

import { FormsModule } from "@angular/forms";

import { DragDropModule } from "@angular/cdk/drag-drop";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SongComponent } from './song/song.component';
import { SongDialogComponent } from './song-dialog/song-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    SongDialogComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,

    FormsModule,

    DragDropModule,

    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
