import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-fonctionnalite',
  templateUrl: './fonctionnalite.component.html',
  styleUrls: ['./fonctionnalite.component.css']
})
export class FonctionnaliteComponent implements OnInit {
  public windows_screen_mobile: boolean;
 
  constructor(private mobile_service:CommonService) { 
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("acceuil")
  }

  ngOnInit(): void {
  }

}

