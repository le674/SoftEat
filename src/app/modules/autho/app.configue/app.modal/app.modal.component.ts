import {Component, ElementRef, OnInit } from '@angular/core';
import {Inject} from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppAuthoComponent } from '../../app.autho/app.autho.component';
import { Restaurant } from '../../app.autho/restaurant';

@Component({
  selector: 'modal-selector',
  templateUrl: 'app.modal.component.html',
  styleUrls: ['./app.modal.component.css']
})
export class AppModalComponent implements OnInit {
  private readonly _mat_dialog_ref: MatDialogRef<AppModalComponent>;
  private readonly triggerElementRef: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    adresse: string;
    id: string;
    trigger: ElementRef
}, _mat_dialog_ref:MatDialogRef<AppModalComponent>) {
    this._mat_dialog_ref = _mat_dialog_ref;
    this.triggerElementRef = data.trigger;
    }
  ngOnInit(): void {
    const mat_dialog_config: MatDialogConfig = new MatDialogConfig();
    console.log(this.triggerElementRef);
    
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    console.log(rect.left);
    console.log(rect.bottom);

    mat_dialog_config.autoFocus = true;
    mat_dialog_config.panelClass = "custom-modal"
    mat_dialog_config.width = '300px';
    mat_dialog_config.height = '300px';
    this._mat_dialog_ref.updateSize(mat_dialog_config.width, mat_dialog_config.height);
    this._mat_dialog_ref.updatePosition(mat_dialog_config.position);
  }

  on_no_click(): void {
    this._mat_dialog_ref.close();
  }
  on_send_mail(): void {
    //faire un appel à l'API pour envoyer un message de suppression du restaurant
    this._mat_dialog_ref.close();
  }
}