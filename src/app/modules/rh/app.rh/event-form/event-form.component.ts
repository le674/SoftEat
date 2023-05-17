import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  @ViewChild('addMain') addMain!: ElementRef<HTMLInputElement>;
  @ViewChild('addPrefer') addPrefer!: ElementRef<HTMLInputElement>;
  @ViewChild('addCommon') addCommon!: ElementRef<HTMLInputElement>;

  constructor() { }

  ngOnInit(): void {
  }

  formatRows(main: string, prefer: string, common: string): string  {
  return '<tr><td class="col-xs-3"><input type="text" value="' + main + '" class="form-control editable" /></td>' +
    '<td class="col-xs-3"><input type="text" value="' + prefer + '" class="form-control editable" /></td>' +
    '<td class="col-xs-3"><input type="text" value="' + common + '" class="form-control editable" /></td>' +
    '<td class="col-xs-1 text-center"><a href="#" onClick="deleteRow(this)">' +
    '<i class="fa fa-trash-o" aria-hidden="true"></a></td></tr>';
};

deleteRow(trash: HTMLElement) : void {
  trash.closest('tr')?.remove();
}

addRow(): void {
  const main = this.addMain.nativeElement.value;
  const preferred = this.addPrefer.nativeElement.value;
  const common = this.addCommon.nativeElement.value;
  const rowHtml = this.formatRows(main, preferred, common);
  const newRow = document.createElement('tr');
  newRow.innerHTML = rowHtml;
  const addRowElement = document.querySelector('#addRow');
  if (addRowElement) {
    addRowElement.insertAdjacentElement('afterend', newRow);
  }
  this.addMain.nativeElement.value = '';
  this.addPrefer.nativeElement.value = '';
  this.addCommon.nativeElement.value = '';
}


onClickAdd() {
  this.addRow();
}

}
