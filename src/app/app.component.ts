import { Observable } from 'rxjs';
import { SongDialogResult } from './song-dialog/song-dialog-result';
import { SongDialogComponent } from './song-dialog/song-dialog.component';
import { Song } from './song/song';
import { Component } from '@angular/core';

import { CdkDragDrop, transferArrayItem, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";

import { AngularFirestore } from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  songsOld: Song[] = [
    {
      title: 'Ohne Dich',
      text: `
Dmi Ami Gmi F Ami

1:
Dmi                 Ami
   Ich werde in die tannen gehen
Gmi                F       Ami
Dahin wo ich sie zuletzt gesehn
Dmi                         Ami
   Doch der Abend wirft ein Tuch aufs Land
Gmi                       F     Ami
 Und auf die Wege hinterm Waldesrand
Dmi                         Ami
   Und der Wald er steht so schwartz und leer
Gmi
Weh mir of weh
F              Ami
 Und die Vögel signen nich mehr

R:
Dmi                            Ami
Ohne dich kann ich nicht sein, ohne dich
Gmi                     F         Ami
Mit dir bin ich allein, Ohne dich
Dmi                              Ami
Ohne dich zählt ich die Stunden, Ohne dich
Gmi                          F            Ami
Mit dir stehen die Sekunden, lohnen nicht

2:
Dmi                     Ami
   Auf den Ästen in den Gräben
Gmi                       F Ami
Ist es nun Still und ohne Leben
Dmi                      Ami
 Und das Atmen fällt mir ach so schwer
Gmi
 Weh mir oh weh
F              Ami
 Und die Vögel signen nich mehr

R:
Dmi                            Ami
Ohne dich kann ich nicht sein, ohne dich
Gmi                     F         Ami
Mit dir bin ich allein, Ohne dich
Dmi                              Ami
Ohne dich zählt ich die Stunden, Ohne dich
Gmi                          F            Ami
Mit dir stehen die Sekunden, lohnen nicht

B:
Dmi                      Ami
 Und das Atmen fällt mir ach so schwer
Gmi
 Weh mir oh weh
F              Ami
 Und die Vögel signen nich mehr

R:
Dmi                            Ami
Ohne dich kann ich nicht sein, ohne dich
Gmi                     F         Ami
Mit dir bin ich allein, Ohne dich
Dmi                              Ami
Ohne dich zählt ich die Stunden, Ohne dich
Gmi                          F             Ami
Mit dir stehen die Sekunden, lohnen nicht, Ohne dich

...
      `
    },
    {
      title: 'První píseň',
      text: `
1:
    Ami        E              Ami
Tak jako se Ti stejská po tom lese,
    Ami          E              Ami
tak holce tvý se stejská po tom plese.
     G         D           G
Když tancovala měla přes míru
  G          D           G
a poblila si tu svou kanýru.

R:
 D           G         c
Ona řekla že jí to nevadí,
D            G          C
že jí stejně někdo pohladí.

Ami E Ami
Ami E Ami

2:
    Ami        E              Ami
Tak jako lyška mládě v zubech nese,
    Ami           E            Ami
tak brtník medvěd někde v lese rve se.
      G              D         G
S tou holkou která v bílym baráku,
G        D          G
porodila dítě v roláku.

R:
 D           G         C
Ona řekla že jí to nevadí,
D            G          C
že jí stejně někdo pohladí.

Ami E Ami
Ami E Ami

3:
    Ami          E         Ami
Jak smrtka hlavy nelítosně kosí,
    Ami          E            Ami
tak nad krajinou kroužej roje vosí.
  G            D         G
A slunce k západu se obrací,
  G           D             G
a tahle holka splývá s matrací.

R:
 D           G         C
Ona řekla že jí to nevadí,
D            G          C
že jí stejně někdo pohladí.

Ami E Ami
Ami E
Ami E
Ami E Ami
      `
    },
    { title: 'A', text: 'B' },
    { title: 'B', text: 'B' },
    { title: 'C', text: 'B' },
    { title: 'D', text: 'B' },
    { title: 'E', text: 'B' },
    { title: 'F', text: 'B' },
    { title: 'G', text: 'B' },
    { title: 'H', text: 'B' },
    { title: 'CH', text: 'B' },
  ]

  songs = this.store.collection('songs').valueChanges({idField: 'id'}) as Observable<Song[]>
  play = this.store.collection('play').valueChanges({idField: 'id'}) as Observable<Song[]>

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  drop(event: CdkDragDrop<Song[]|null>): void {
    if (!event.container.data || !event.previousContainer.data) {
      return
    }

    const item = event.previousContainer.data[event.previousIndex]
    this.store.firestore.runTransaction(()=>{
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item)
      ])
      return promise
    })

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  newSong(): void {
    const dialogRef = this.dialog.open(SongDialogComponent, {
      data: {
        width: '90vw',
        song: {}
      }
    })
    dialogRef.afterClosed().subscribe((result: SongDialogResult | undefined) => {
      if (!result || !result.song || !result.song.title) {
        return
      }
      this.store.collection('songs').add(result.song)
    })
  }

  editSong(list: 'songs' | 'play', song: Song): void {
    const dialogRef = this.dialog.open(SongDialogComponent, {
      width: '100vw',
      height: '95vh',
      data: {
        song,
        enableDelete: true
      }
    })
    dialogRef.afterClosed().subscribe((result: SongDialogResult | undefined) => {
      if (!result) {
        return
      }
      if (result.delete) {
        this.store.collection(list).doc(song.id).delete()
      } else {
        this.store.collection(list).doc(song.id).update(song)
      }
    })
  }
}
