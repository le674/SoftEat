import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "daypilot-pro-angular";
import { CalendarService } from "./calendar-data.service";
import { from, Subscription } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EventFormComponent } from '../event-form/event-form.component';
@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  users !: string;
  @Input() userRole!:string;
  status: string = '';
  statusSubscription!: Subscription;

  constructor(private ds: CalendarService, private dialog: MatDialog, private snackBar : MatSnackBar) {
    this.viewWeek(); //Configuration de calendrier par semaine à l'initialisation
  }

  //Charge les événements de l'utilisateur actuel à l'initialisation
  ngOnInit(): void {
    this.ds.currentData.subscribe(data => {
      this.users = data;
      this.loadEvents(this.users);
      this.statusSubscription = this.ds.statusService.subscribe(
        (status) => {
          this.status = status;
          if (this.status !==''){
            this.snackBar.open(this.status);
          }
          else {
            this.snackBar.dismiss();
          }
        }
      );
    });
  }


  moisEnTouteLettre = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  events: DayPilot.EventData[] = [];
  date = DayPilot.Date.today();

  //Mise en forme de la bulle d'information des événements
  bubble = new DayPilot.Bubble({
    zIndex: 500,
    onLoad: function (args) {
      // Trouver l'index de la première virgule
      const commaIndex = args.source.data.text.indexOf(',');
      // Extraire la première partie du texte
      const lieu = args.source.data.text.slice(0, commaIndex).trim();
      // Extraire la deuxième partie du texte
      const description = args.source.data.text.slice(commaIndex + 1).trim();
      const start = new Date(args.source.data.start);
      const end = new Date(args.source.data.end);

      const startTime =
        start.getHours().toString().padStart(2, '0') +
        ':' +
        start.getMinutes().toString().padStart(2, '0');
      const endTime =
        end.getHours().toString().padStart(2, '0') +
        ':' +
        end.getMinutes().toString().padStart(2, '0');

      let bubbleContent =

        '<div>' +
        '<strong>' +
        args.source.data.tags +
        '</strong><br>';

      if (args.source.data.resource) {
        bubbleContent += '<div>Personnel : ' + args.source.data.resource + '</div>';
      }

      if (lieu) {
        bubbleContent += '<div>Lieu : ' + lieu + '</div>';
      }

      bubbleContent +=
        '<div>Description : ' +
        description +
        '</div>' +
        '<div>' +
        startTime +
        ' - ' +
        endTime +
        '</div>';

        // Permet d'afficher la durée totale de l'événement
      const duration = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60)
      ); // Difference in minutes
      const durationHours = Math.floor(duration / 60);
      const durationMinutes = duration % 60;

      if (durationHours > 0 || durationMinutes > 0) {
        let durationText = '';

        if (durationHours > 0) {
          durationText += durationHours + ' heure';
          if (durationHours > 1) {
            durationText += 's';
          }
        }

        if (durationMinutes > 0) {
          if (durationText !== '') {
            durationText += ' ';
          }
          durationText += durationMinutes + ' minute';
          if (durationMinutes > 1) {
            durationText += 's';
          }
        }

        bubbleContent += '<div>Durée : ' + durationText + '</div>';
      }

      bubbleContent += '</div>';

      args.html = bubbleContent;
    },
  });

  configNavigator: DayPilot.NavigatorConfig = {
  }; //Permet de garder en mémoire quelle configuration (jour/semaine/mois) est sélectionnée

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  //Passer au jour/semaine/mois précédent
  previous(){
    if (this.configNavigator.selectMode == "Day"){
      this.date = this.date.addDays(-1);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Week") {
      this.date = this.date.addDays(-7);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Month") {
      this.date = this.date.addMonths(-1)
      this.changeDate(this.date);
    }
  }

  //Passer au jour/semaine/mois suivant
  next(){
    if (this.configNavigator.selectMode == "Day"){
      this.date = this.date.addDays(1);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Week") {
      this.date = this.date.addDays(7);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Month") {
      this.date = this.date.addMonths(1)
      this.changeDate(this.date);
    }
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  //Option pour la configuration par "Jour"
  configDay: DayPilot.CalendarConfig = {
    locale : "fr-fr", //heure française
    eventMoveHandling : "Disabled", 
    eventResizeHandling : "Disabled", //désactivation des interactions utilisateur sur les événements
    eventArrangement : "SideBySide",  //les événements qui se chevauchent ne se superposent pas
    bubble:this.bubble, //affichage de la bulle d'information des événements
    contextMenu : new DayPilot.Menu({
      items: [
        {
          text: "Supprimer",
          image: "../../../../assets/images/trash.png",
          onClick: async (args) => {
            var e = args.source;
            await this.ds.remove_event('foodandboost_prop', e.resource(), e.id());
            this.loadEvents(this.users);
          }
        }
      ], //Permet de supprimer l'événement sur lequel on a fait un clic droit
      onShow: (args) => {
        var e = args.source;
        if (this.userRole!=='gerant') {
          if (args.menu && args.menu.items && args.menu.items[0]) {
            args.menu.items[0].disabled = true; //Désactivation de cette option si l'utilisateur n'est pas gerant
          }
        }
        else {
          if (args.menu && args.menu.items && args.menu.items[0]) {
            args.menu.items[0].disabled = false;
          }
        }
      }       
    }),
    dayBeginsHour: 8,
    dayEndsHour: 24,
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          break;
      }
      // Trouver l'index de la première virgule
      const commaIndex = args.data.text.indexOf(',');
      // Extraire la première partie du texte
      const lieu = args.data.text.slice(0, commaIndex).trim();
      // Extraire la deuxième partie du texte
      const evenement = args.data.text.slice(commaIndex + 1).trim();
      let resourceHtml = args.data.resource ? "<div style='font-style: italic;'>" + lieu + "</div>" : "";
      args.data.html = "<span class='event'><strong>" + args.data.tags + "</strong><br>" +
        resourceHtml + "<br>" +
        args.data.text + "</span>"; //Mise en forme du texte à afficher dans l'événement
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    locale: "fr-fr",
    width: "110%",
    heightSpec: "Fixed",
    height: 600,
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventArrangement: "SideBySide",
    bubble: this.bubble,
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Supprimer",
          image: "../../../../assets/images/trash.png",
          onClick: async (args) => {
            var e = args.source;
            await this.ds.remove_event('foodandboost_prop', e.resource() , e.id()); 
            this.loadEvents(this.users);
          }
        }
      ],
      onShow: (args) => {
        var e = args.source;
        if (this.userRole!=='gerant') {
          if (args.menu && args.menu.items && args.menu.items[0]) {
            args.menu.items[0].hidden = true;
          }
        }
        else {
          if (args.menu && args.menu.items && args.menu.items[0]) {
            args.menu.items[0].hidden = false;
          }
        }
        console.log(this.userRole);  // Accessing userRole here
      }
    }),    
    dayBeginsHour : 8,
    dayEndsHour : 24,
    viewType: "Week",
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          break;
      }
      // Trouver l'index de la première virgule
      const commaIndex = args.data.text.indexOf(',');
      // Extraire la première partie du texte
      const lieu = args.data.text.slice(0, commaIndex).trim();
      // Extraire la deuxième partie du texte
      const evenement = args.data.text.slice(commaIndex + 1).trim();
      let resourceHtml = args.data.resource ? "<div style='font-style: italic;'>" + lieu + "</div>" : "";
      args.data.html = "<span class='event'><strong>" + args.data.tags + "</strong><br>" +
        resourceHtml + "<br>" +
        evenement + "</span>";
    }
  };

  configMonth: DayPilot.MonthConfig = {
    locale: "fr-fr",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    bubble: this.bubble,
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Supprimer",
          image: "../../../../assets/images/trash.png",
          onClick: async (args) => {
            var e = args.source;
            await this.ds.remove_event('foodandboost_prop', e.resource(), e.id());
            this.loadEvents(this.users);
          }
        }
      ]
    }),
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          break;
      }
    }
  };



  ngAfterViewInit(): void {
    this.loadEvents("");
  }

  //Chargement des événements des utilisateurs sélectionnés
  loadEvents(users : string): void {
    from(this.ds.getEventsFromAllUsers("foodandboost_prop", users)).subscribe(result => {
      this.events = result;
    });
  }
  //Changements entre les différentes configurations
  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }
  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }
  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  //ouvre le form "ajouter un évènement"
  openEventForm(): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '85vw',
      height: '85vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDialogClosed();
    });
  }
  //recharge les évènements pour actualiser le calendrier à la fermeture du form
  onDialogClosed(): void {
    this.loadEvents(this.users);
  }
  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  } 
}