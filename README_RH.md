# Documentation RH

## 1. Architecture du projet

La partie Calendrier de l'onglet *RH* est constituée des composants suivants :

 - `CalendarViewComponent` : Ce composant utilise le module DayPilot pour afficher une vue de calendrier. Le service `CalendarService` est utilisé pour interagir avec la base de données Firebase pour stocker et récupérer des données d'événement.
 - `HbarComponent` : Ce composant permet en tant qu'employé d'effectuer des demandes de congés directement depuis l'onglet *RH*.
 - `NavbarComponent` : Ce composant permet en tant que gérant de pouvoir visualiser la liste des employés du restaurant sous forme de Navbar et de cliquer sur leur nom pour afficher leurs événements sur le calendrier.
 - `EventFormComponent` : Ce composant permet en tant que gérant d'ouvrir un formulaire facilitant l'ajout d'événements.

Dans la RealTime DataBase, les événements sont stockés dans `users/foodandboost_prop/{utilisateur}/planning/events`.


## 2. CalendarViewComponent

Le `CalendarViewComponent` est explicité plus en détail dans le fichier : `README_Daypilot.md`. Ce composant est responsable de l'affichage des événements du calendrier comme sur l'image ci-dessous. 

![CalendarViewComponent](https://zupimages.net/up/23/25/ctcl.png)

Voici ses principaux attributs et méthodes.

### Attributs

- `users`: permet de connaître les utilisateurs sélectionnés par le gérant dans le `NavbarComponent` afin d'afficher leurs événements.
- `@Input() userRole`: rôle de l'utilisateur actuellement connecté pour modifier la vue de l'application selon le rôle du compte connecté.
- `status`: contient le message de chargement qui sera soit un string vide soit "Chargement..." à afficher sous forme de SnackBar.
- `statusSubscription`: un abonnement au service `CalendarService` permettant de compléter `status` en fonction de sa valeur dans le service.
- `moisEnTouteLettre`: un tableau des noms des mois en français utilisé pour l'affichage des mois du calendrier.
- `events`: un tableau des événements à afficher sur le calendrier. Il est complété dynamiquement par la méthode `loadEvents`.
- `date`: la date actuelle. Elle change quand l'utilisateur utilise les méthodes `previous` ou `next`.
- `bubble`: l'objet qui gère l'affichage des bulles d'informations des événements.
- `configNavigator`: configuration de l'élément DayPilot.Navigator utilisé pour changer la date.
- `configDay`: configuration pour l'affichage du calendrier en vue "jour".
- `configWeek`: configuration pour l'affichage du calendrier en vue "semaine".
- `configMonth`: configuration pour l'affichage du calendrier en vue "mois".

### Méthodes

- `constructor`: construit le composant avec des champs privés de `CalendarService` pour la gestion du Back-End, de `MatDialog` pour l'affichage du formulaire et de  `MatSnackBar` pour les alertes de chargement.
- `ngOnInit`: permet d'afficher dynamiquement les événements en récupérant les utilisateurs sélectionnés depuis le service `CalendarService`, service qui les récupère lui-même du `NavbarComponent`. Pendant le chargement des événements, affiche le "Chargement..." sur le SnackBar.
- `selectTomorrow`: sélectionne le jour suivant.
- `previous`: passe au jour/semaine/mois précédent en changeant la date.
- `next`: passe au jour/semaine/mois suivant en changeant la date.
- `changeDate`: change la date du calendrier.
- `loadEvents`: charge les événements des utilisateurs sélectionnés.
- `viewDay`: configure l'affichage du calendrier en vue "jour". (cf `README_DayPilot.md`)
- `viewWeek`: configure l'affichage du calendrier en vue "semaine". (cf `README_DayPilot.md`)
- `viewMonth`: configure l'affichage du calendrier en vue "mois". (cf `README_DayPilot.md`)
- `openEventForm`: ouvre un formulaire pour ajouter un nouvel événement, utilise le composant `EventFormComponent`.

### BDD

-  `getEventsFromAllUsers(prop: string, usersMails: string)` : Cette méthode est utilisée pour obtenir tous les événements de tous les utilisateurs. Elle prend en entrée un string `prop` pour le propriétaire et un string `usersMails`. Le string `prop` est utilisé pour spécifier le chemin dans la base de données, et le string `usersMails` contient les e-mails de tous les utilisateurs dont vous souhaitez obtenir les événements. Cette méthode renvoie une promesse résolue avec un tableau d'objets de type `DayPilot.EventData[]`, rempli en appelant pour chaque utilisateur la méthode `getEvents`.
    
-  `getEvents(prop: string, userMail: string)` : Cette méthode est utilisée pour obtenir les événements d'un utilisateur spécifique. Elle prend en entrée un string `prop` et un string `userMail`. Le string `prop` est utilisé pour spécifier le chemin dans la base de données, et le string `userMail` est l'e-mail de l'utilisateur dont vous souhaitez obtenir les événements. Cette méthode parcoure les événements de l'utilisateur et les renvoie sous un tableau de type `DayPilot.EventData[]`.
    
-  `add_event(prop: string, user: string, newEvent: DayPilot.EventData)` : Cette méthode est utilisée pour ajouter un nouvel événement pour un utilisateur spécifique. Elle prend en entrée un string `prop`, un string `user` et un objet `newEvent` de type `DayPilot.EventData`. Le string `prop` est utilisé pour spécifier le chemin dans la base de données, le string `user` est l'e-mail de l'utilisateur et `newEvent` est l'événement à ajouter. Si l'événement est un congé, la méthode diminue aussi le nombre de congés restants pour l'utilisateur dans la base de données.
    
-  `remove_event(prop: string, userMail: string, eventId: string)` : Cette méthode est utilisée pour supprimer un événement d'un utilisateur spécifique. Elle prend en entrée un string `prop`, un string `userMail` et un string `eventId`. Le string `prop` est utilisé pour spécifier le chemin vers la base de données, le string `userMail` est l'e-mail de l'utilisateur et le string `eventId` est l'ID de l'événement à supprimer.
    
-  `getPath(email: string)` : Cette méthode est utilisée pour obtenir le chemin vers la base de données d'un utilisateur à partir de son e-mail. Elle prend en entrée un string `email`. 
    
-  `changeUsers(newUsers: string)` : Cette méthode est utilisée pour changer la liste des utilisateurs sélectionnés dynamiquement. Elle prend en entrée un string `newUsers` qui contient les nouveaux utilisateurs à sélectionner.

## 3. HbarComponent

`HbarComponent` est un composant Angular responsable de la gestion des demandes de congé dans l'application. Ce composant permet aux utilisateurs d'envoyer des demandes de congé, de choisir un fichier joint, et d'auto-remplir certaines informations.

![HbarComponent](https://zupimages.net/up/23/25/mz4b.png)

### Attributs

- `form` : Une référence au `NgForm`, utilisée pour interagir avec le formulaire de demande de congé.
- `motif, autofillConge, autofillRTT, autofillMate, autofillPate, dateDebutInput, dateFinInput` : Des références aux éléments du formulaire pour interagir avec les différents champs du formulaire.
- `dateWidth` : La largeur de l'élément de date, utilisée pour rendre l'espace occupé par la date adapté.
- `conges` : Le nombre de jours de congé restants de l'utilisateur.
- `selectedShortenedFileName, selectedFileName` : Les noms des fichiers joints aux demandes de congé, les fichiers à joindre peuvent être sélectionnés mais ne sont pas envoyés lors du click sur le bouton "Envoyer".
- `convActive` : Le chemin vers la conversation 'RH' dans la base de données Firebase.
- `firebaseApp` : Une instance de `FirebaseApp` pour interagir avec la base de données.
- `date, email, conv, name, surname, role` : Les informations de l'utilisateur courant, qui seront affichées dans le message qui sera envoyé sur la messagerie.

### Méthodes

- `ngAfterViewInit()` : Méthode appelée après que la vue du composant a été initialisée. Elle calcule la largeur de l'élément de date et détecte les changements.

- `calculateInputWidth()` : Méthode pour calculer la largeur de l'élément de date en fonction de son contenu.

- `ngOnInit()` : Méthode appelée lors de l'initialisation du composant. Elle récupère les congés de l'utilisateur, son email, et configure la conversation active pour "RH", en fonction de l'utilisateur. L'email est récupéré depuis le localStorage (donnée mise en cache).

- `getCongesColorStyle(conges: number)` : Méthode pour obtenir la couleur du nombre de jours de congé. Plus ce nombre est proche de 30 (valeur pouvant  être modifiée), plus la couleur est verte, et plus le nombre est proche de 0, plus la couleur est rouge.

- `autofillInput(value: string)` : Méthode pour remplir automatiquement le motif de la demande de congé.

- `displayFileName(event: any)` : Méthode pour afficher le nom du fichier joint à la demande de congé.

- `getShortenedFileName(fileName: string)` : Méthode pour obtenir une version raccourcie du nom du fichier, si sa longueur dépasse 20 caractères.

- `unchooseFile()` : Méthode pour annuler le choix d'un fichier joint.

- `onSubmit()` : Méthode pour gérer la soumission du formulaire de demande de congé. Cela inclut notamment l'envoi d'un message formaté avec la méthode `sendMessage`.

- `clearForm()` : Méthode pour réinitialiser le formulaire de demande de congé et le nom du fichier sélectionné.

- `getConv()` : Méthode pour obtenir la conversation RH privée, le nom et le prénom de l'utilisateur à partir du LocalStorage.

- `fetchTimeServer()` : Méthode pour récupérer l'heure du serveur.

- `sendMessage(message: string)` : Méthode pour envoyer un message contenant les informations de la demande de congé à la base de données Firebase, message qui apparaitra dans le canal RH correspondant à l'utilisateur.

## 4. NavbarComponent

![NavbarComponent](https://zupimages.net/up/23/25/r492.png)

### Attributs

-  `Categories`: Un tableau d'objets contenant le nom de la catégorie, un booléen indiquant si la catégorie est ouverte ou non, et le nom du bouton.
    
-  `Serveurs`, `Gerants`, `Rh`, `Autres`: Ces tableaux contiennent les utilisateurs en fonction de leurs rôles.
    
-  `select` et `selectMail`: Ces tableaux contiennent les noms et les mails des utilisateurs sélectionnés respectivement. Les mails sélectionnés sont envoyés au service `CalendarService` pour modifier dynamiquement les événements à charger dans `CalendarViewComponent`.
    
-  `isChecked`, `selectAll`, `selectAllServeurs`, `selectAllGerants`, `selectAllRh`, `selectAllAutres`: Ces booléens gèrent l'état de sélection des utilisateurs dans chaque catégorie.
    
-  `new_users`: contient une chaîne de caractères qui est une liste de mails des utilisateurs sélectionnés, séparés par des virgules.
    
-  `@Input() userMail` et `@Input() userNomComplet`: viennent prendre le mail et le nom complet de l'utilisateur actuel.
    

### Méthodes

-  `ngOnInit`: Initialise le composant avec aucune catégorie déroulée, le nom des utilisateurs chargés et mis en cache, et l'utilisateur en cours pré-sélectionné.
    
-  `selectUser`: Ajoute le nom et le mail de l'utilisateur dans les tableaux `select` et `selectMail` respectivement.
    
-  `openCategories`: Change l'état d'ouverture et le nom du bouton des catégories.
    
-  `selectEmployee`: Gère l'ajout et la suppression d'un employé dans les listes de sélection et envoie la nouvelle liste d'utilisateurs au `calendarService`.
    
-  `addAllItems`: Ajoute ou supprime tous les éléments d'une catégorie dans les listes de sélection et vient appeler la méthode `selectEmployee` pour chaque employé de cette catégorie.
    
-  `addAllServeurs`, `addAllGerants`, `addAllRh`, `addAllAutres`: Ces méthodes gèrent l'ajout ou la suppression de tous les utilisateurs d'une certaine catégorie.
    
-  `fetchUser`: Récupère les données des utilisateurs de la base de données Firebase et les stocke dans les tableaux correspondants en fonction de leurs rôles. Cette méthode vient aussi mettre les noms des différents utilisateurs en cache pour s'en resservir dans `EventFormComponent`.

## 5. EventFormComponent

`EventFormComponent` est un composant qui fournit une interface pour créer, ajouter et gérer des événements. Ces événements sont stockés dans la base de données et peuvent être affichés sur le calendrier.

![EventFormComponent](https://zupimages.net/up/23/25/dw4f.png)

### Attributs

- `dateWidth`: La largeur de l'input de la date. Par défaut, sa valeur est '150px'.
- `Categories`, `Serveurs`, `Gerants`, `Rh`, `Autres`: Ces sont des tableaux utilisés pour stocker des informations sur différentes catégories de personnel. Les éléments du tableau sont les mêmes que dans le `NavbarComponent`.
- `newEvent`: Objet utilisé pour stocker les informations sur le nouvel événement à créer.
- `rows`: Tableau d'objets de type `Row`. Chaque objet `Row` contient des informations sur un événement, telles que le personnel concerné, le motif de l'événement, le lieu, les dates de début et de fin, et si l'événement doit être répété.

### Méthodes

- `ngOnInit()`:  Initialise les différentes catégories de personnel en les récupérant du `localStorage` et ajoute un écouteur d'événement `input` à certains champs du formulaire pour leur appliquer une majuscule automatique.
- `truncateInputValue(input: HTMLInputElement)`: Cette méthode ajoute une majuscule au début de la valeur du champ de saisie spécifié.
- `ngAfterViewInit()` et `calculateInputWidth()`: Ces méthodes sont utilisées pour rendre l'espace occupé par le champ de date responsive.
- `addRow()`, `resetFormFields()` et `deleteRow(index: number)`: Ces méthodes permettent respectivement d'ajouter une nouvelle ligne à la liste des événements, de réinitialiser les champs du formulaire et de supprimer une ligne de la liste des événements.
- `isFieldFilled(inputRef: ElementRef<HTMLInputElement | HTMLSelectElement>)`: Cette méthode vérifie si un champ de formulaire est rempli.
- `onClickAdd()`: Cette méthode est appelée lorsqu'un utilisateur clique sur le bouton Ajouter. Elle vérifie si tous les champs requis sont remplis et que la date de fin est postérieure à la date de début. Si tout est valide, elle ajoute la nouvelle ligne à la liste des événements et réinitialise les champs du formulaire.
- `saveRows()`: Cette méthode est utilisée pour enregistrer les lignes d'événements dans la base de données Firebase. Elle prend en compte la répétition des événements selon la sélection de l'utilisateur.
- `isSameDay(date1: Date, date2: Date)`: Cette méthode vérifie si deux dates correspondent au même jour.
- `formatDate(date: Date)`: Cette méthode convertit un objet `Date` en une chaîne de caractères au format `YYYY-MM-DD`. 
- `getMotifLabel(value: string)`: Cette méthode prend en entrée la valeur de motif sélectionnée et renvoie une chaîne de caractères représentant le motif correspondant.
- `getRepeterLabel(value: string)`: Cette méthode prend en entrée la valeur de répétition sélectionnée et renvoie une chaîne de caractères représentant la périodicité correspondante.
- `addEvent(userId: string, newEvent: DayPilot.EventData)`: Cette méthode est utilisée pour ajouter un nouvel événement au calendrier grâce au service `CalendarService`. Elle prend deux arguments : `userId`, qui est une chaîne de caractères représentant l'identifiant de l'utilisateur, et `newEvent`, qui contient les informations sur le nouvel événement.
- `closeDialog()`: Cette méthode ferme la boîte de dialogue en cours. 
- `getCategoryUsers(category: String)`: Cette méthode renvoie une liste d'utilisateurs appartenant à la catégorie spécifiée.