import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {
  @Input() folders:Array<string>;
  @Output() folder = new EventEmitter<string>();
  constructor() { 
    this.folders = [];
  }
  ngOnInit(): void {
  }
  testClick($event:MouseEvent, folder:string){
    this.folder.emit(folder);
  }
  decouperListe(liste:Array<any>, tailleSousListe:number) {
    const sousListes = [];
    const nombreDeSousListes = Math.ceil(liste.length / tailleSousListe);
  
    for (let i = 0; i < nombreDeSousListes; i++) {
      const debut = i * tailleSousListe;
      const fin = debut + tailleSousListe;
      sousListes.push(liste.slice(debut, fin));
    } 
    return sousListes;
  }
}
