# Guide d'utilisation du module DayPilot

## 1. Comprendre l'architecture du projet

Le partie Calendrier de l'onglet *RH* est principalement constitué d'un composant Angular appelé `CalendarViewComponent`. Ce composant utilise le module DayPilot pour afficher une vue de calendrier. Le service `CalendarService` est utilisé pour interagir avec la base de données Firebase pour stocker et récupérer des données d'événement.

Dans la RealTime DataBase, les événements sont stockés dans `users/foodandboost_prop/{utilisateur}/planning/events`.

Il existe trois configurations principales pour le calendrier : `configDay`, `configWeek` et `configMonth`, qui définissent respectivement comment les vues par jour, semaine et mois du calendrier sont configurées.

## 2. Modifier une fonctionnalité du calendrier

Pour modifier une fonctionnalité spécifique du calendrier, il faut généralement travailler avec la configuration appropriée (`configDay`, `configWeek` ou `configMonth`). Chaque configuration contient des propriétés et des méthodes qui sont utilisées pour définir divers aspects du comportement du calendrier, tels que le rendu des événements, les menus contextuels, les heures de début et de fin de journée, etc. La liste des propriétés pouvant être modifiées pour chaque configuration est listée sur le lien suivant : [Propriétés Calendrier DayPilot](https://api.daypilot.org/daypilot-calendar-properties/).

Un exemple de méthode très utilisée par l'équipe Ping durant le projet pour modifier l'affichage des événements dans la vue hebdomadaire, est la méthode `onBeforeEventRender` de `configWeek`. Cela permet d'ajouter du style aux événements selon leur type (Travail, Congé, Maladie, Entretien), d'ajouter une description, un lieu...

Voici quelques propriétés déjà traitées par notre équipe Ping que vous pourriez vouloir modifier:

- `locale` : change la langue du calendrier.

- `eventMoveHandling` et `eventResizeHandling` : contrôlent si les événements peuvent être déplacés ou redimensionnés par l'utilisateur.

- `bubble` : permet de configurer les informations qui seront affichées dans la bulle lors du survol d'un événement.

- `contextMenu` : définit le menu contextuel qui apparaît lorsque vous cliquez avec le bouton droit sur un événement.

- `dayBeginsHour` et `dayEndsHour` : déterminent l'heure de début et de fin de la journée affichée sur le calendrier.

- `onBeforeEventRender` : permet de modifier l'apparence des événements avant leur rendu sur le calendrier.

## 3. Ajouter de nouvelles options à DayPilot

DayPilot est un module très flexible qui offre de nombreuses options de personnalisation. Vous pouvez ajouter de nouvelles options en les ajoutant simplement à la configuration appropriée. Par exemple, si vous souhaitez ajouter une nouvelle option pour changer la couleur de fond d'un événement en fonction de son type, vous pouvez le faire en ajoutant une nouvelle condition dans la fonction `onBeforeEventRender`.

Voici un exemple de comment vous pourriez faire cela :

```javascript
onBeforeEventRender: args => {
if (args.data.tags === "Congé") {
args.data.backColor = "rgba(0, 255, 0, 0.2)"; 
// Modifie la couleur de fond en vert pour les congés
	}
}
```

## 4. Modifier la navigation du calendrier

La navigation entre les différentes vues du calendrier est gérée par les méthodes `viewDay`, `viewWeek` et `viewMonth`. Ces méthodes modifient le `selectMode` du `configNavigator` et déterminent quelle configuration du calendrier est visible. Pour ajouter de nouvelles vues ou modifier la navigation, vous pouvez modifier ces méthodes.

## 5. Interagir avec la base de données

La méthode `loadEvents` est utilisée dans `calendar-services.ts` pour charger les événements du calendrier à partir de la base de données Firebase. Pour modifier la façon dont les événements sont chargés ou pour interagir avec la base de données d'une autre manière, il faut modifier cette méthode ou ajouter de nouvelles méthodes en fonction des besoins.

## 6. Modifier les éléments d'information
Le menu qui apparait au clic droit sur un événement est défini dans les configurations du calendrier avec l'option `contextMenu`. Vous pouvez ajouter de nouvelles actions en ajoutant des `items` (options) à ce menu ou modifier les actions existantes en modifiant le menu contextuel dans les configurations appropriées.

Il est aussi possible de modifier la bulle d'informations qui apparait quand on survole un événement avec la souris. Cette bulle est implémentée avec le champ privé `bubble` de `calendar-view.component.ts`. Ensuite, chaque configuration (jour, semaine, mois) implémente la bulle via la ligne suivante : `bubble : this.bubble`.


## 7. Navigation dans le temps

Pour la navigation dans le temps, la méthode `previous()` et `next()` permet de naviguer dans le calendrier. Si vous voulez changer la logique de cette navigation, c'est là que vous devrez apporter des modifications. Actuellement, il est configuré pour naviguer jour par jour, semaine par semaine, ou mois par mois selon le mode de sélection du calendrier.


## 8. Chargement des événements

La méthode `getEvents()` de `calendar-service.ts` est responsable de la récupération des événements depuis la base de données Firebase et de leur mise à jour sur le calendrier. Pour modifier la façon dont les événements sont récupérés ou la source de données utilisée (par exemple dans le cas de l'utilisation de FireStore à la place de la RealTime DataBase), c'est là q'il faudra apporter des modifications.

## 9. Ajouter ou supprimer des événements

Actuellement, les événements peuvent être supprimés en cliquant avec le bouton droit sur un événement et en choisissant "Supprimer" dans le menu contextuel. La suppression de l'événement est effectuée par la méthode `remove_event()` du service `CalendarService`.

L'ajout d'événements est réalisé en utilisant une fenêtre de dialogue. La méthode `openEventForm()` ouvre une fenêtre de dialogue qui contient le composant `EventFormComponent`. Après remplissage des informations de l'événement dans le formulaire, la méthode `add_event` du `CalendarService` sera appelée pour ajouter l'événement à la base de données. La méthode `onDialogClosed()` est appelée lorsque cette fenêtre de dialogue est fermée et recharge les événements depuis la base de données.

## 10. Options DayPilot supplémentaires

DayPilot offre de nombreuses autres options et fonctionnalités qui pourraient être ajoutées à ce projet selon les besoins. Par exemple, il est également possible d'ajouter la possibilité de déplacer ou de redimensionner les événements directement depuis le calendrier.

Pour SoftEat, une option intéressante serait d'utiliser le **Scheduler** qui est un autre type de calendrier fourni par DayPilot. Le [Scheduler](https://doc.daypilot.org/scheduler/angular/) est spécialement conçu pour d'autres types de gestion, comme la réservation de tables d'un restaurant :

![Gestion de réservation de tables avec le Scheduler](https://cdn.doc.daypilot.org/page/image/g5gl77qopbdnjm2fw3mxoexxei/angular-scheduler-component.png)

Enfin, de nombreuses autres options sont disponibles pour le calendrier et le Scheduler en utilisant la version Pro de DayPilot. Celle-ci permet de débloquer de nombreuses fonctionnalités avancées. Par exemple, elle offre un support complet pour le glisser-déposer,  l'ajout dynamique d'événements directement depuis l'interface utilisateur, l'ajout de plages horaires pendant lesquelles aucun événement ne peut être planifié, les événements multijours, qui s'étendent sur plusieurs jours, et enfin de nombreuses fonctionnalités supplémentaires pour contrôler l'apparence des événements et des éléments du calendrier.