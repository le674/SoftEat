import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';

declare let gapi: any;
declare let google: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // Set to client ID and API key from the Developer Console
    CLIENT_ID!: string;
    API_KEY !: string;
    DISCOVERY_DOC !: string;
    SCOPES !: string;
    tokenClient !: any;
    gapiInited !: boolean;
    gisInited !: boolean;
    @ViewChild('authorizeButton') authorizeButton!: ElementRef;
    @ViewChild('signoutButton') signoutButton!: ElementRef;
    @ViewChild('addEventButton') addEventButton!: ElementRef;
    @ViewChild('content') content!: ElementRef;


  constructor (){
    this.CLIENT_ID = '216726499409-v3aq7s421bttnkkr9aee9brnsdm2n8ko.apps.googleusercontent.com';
    this.API_KEY = 'AIzaSyCh6qQqYc8rHxDFCpgwLKJzjnDNeq0CcjQ';
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
    this.gapiInited = false;
    this.gisInited = false;
  }

  ngOnInit(): void {
    console.log("ngOnInit")
    
    
  }

  ngAfterViewInit(): void {
    this.authorizeButton.nativeElement.style.visibility = 'hidden';
    this.signoutButton.nativeElement.style.visibility = 'hidden';
    this.addEventButton.nativeElement.style.visibility = 'hidden';
    this.loadScript('https://apis.google.com/js/api.js', this.gapiLoaded);
    this.loadScript('https://accounts.google.com/gsi/client', this.gisLoaded);
    console.log("after init success")
  }

  loadScript(url: string, callback: Function) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.defer = true;
    node.onload = () => callback.apply(this);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  gapiLoaded() {
    gapi.load('client', this.initializeGapiClient.bind(this));
    console.log("gapiLoaded")
  }

  async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
    this.maybeEnableButtons();
  }

  gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // defined later
    });
    this.gisInited = true;
    this.maybeEnableButtons();
    console.log("gisLoaded")
  }

  maybeEnableButtons() {
    if (this.gapiInited && this.gisInited) {
      this.authorizeButton.nativeElement.style.visibility = 'visible';
    }
  }

  handleAuthClick() {
    this.tokenClient.callback = async (resp:any) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      this.signoutButton.nativeElement.style.visibility = 'visible';
      this.addEventButton.nativeElement.style.visibility = 'visible';
      this.authorizeButton.nativeElement.innerText = 'Refresh';
      await this.listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      this.tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      this.tokenClient.requestAccessToken({prompt: ''});
    }
  }

  handleSignoutClick() {
    const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          this.content.nativeElement.innerText = '';
          this.authorizeButton.nativeElement.innerText = 'Authorize';
          this.signoutButton.nativeElement.style.visibility = 'hidden';
        }
  }

  async listUpcomingEvents() {
    let response;
        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
        } catch (err:any) {
          this.content.nativeElement.innerText = err.message;
          return;
        }

        const events = response.result.items;
        if (!events || events.length == 0) {
          this.content.nativeElement.innerText = 'No events found.';
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str:any, event:any) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
            this.content.nativeElement.innerText = output;
  }

  async createEvent(): Promise<any> {
    const event = {
      summary: 'SoftEat Test',
      location: '25 rue Dr Rémy Annino, Saint-Etienne',
      description: 'Sprint Retrospective',
      start: {
        dateTime: '2023-05-17T09:00:00-07:00',
        timeZone: 'CET'
      },
      end: {
        dateTime: '2023-05-17T11:00:00-07:00',
        timeZone: 'CET'
      },
      recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
      /*attendees: [
        {email: 'softeat.contact@gmail.com'},
        {email: 'clems.d@orange.fr'}
      ],*/
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60},
          {method: 'popup', minutes: 10}
        ]
      }
    };
  
    try {
      const response = await gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
      console.log('Event created: ' + response.result.htmlLink);
    } catch (err) {
      console.log('Error: ' + err);
    }
  }
  
}
