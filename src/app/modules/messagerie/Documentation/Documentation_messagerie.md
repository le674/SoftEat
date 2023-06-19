<div align="center">
	<div style="display: flex; justify-content: center; align-items: center; background-color: white; padding: 15px; border-radius: 50%; width: 60px; height: 60px">
		<img style="filter: invert(58%) sepia(36%) saturate(716%) hue-rotate(43deg) brightness(99%) contrast(100%);" src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/paper-plane.svg" width="50" height="50">
	</div>
	<h2 align="center">Messagerie</h3>
	<br />
</div>
<br/>

<details>
  <summary>Sommaire</summary>
  <ol>
        <li>
            <a href="#structure-de-la-messagerie">Structure de la messagerie</a>
            <ul style="list-style-type: disc">
                <li><a href="#composants">Composants</a></li>
                <li><a href="#modèles">Modèles</a></li>
            </ul>
        </li>
        <li>
            <a href="#messages">Messages</a>
						<ul style="list-style-type: disc">
                <li><a href="#images">Images</a></li>
                <li><a href="#unit-test">Unit test</a></li>
                <li><a href="#lint">Lint</a></li>
                <li><a href="#coverage">Coverage</a></li>
                <li><a href="#deployment">Deployment</a></li>
            </ul>
        </li>
        <li>
            <a href="#canaux">Canaux</a>
            <ul style="list-style-type: disc">
                <li><a href="#images">Images</a></li>
                <li><a href="#unit-test">Unit test</a></li>
                <li><a href="#lint">Lint</a></li>
                <li><a href="#coverage">Coverage</a></li>
                <li><a href="#deployment">Deployment</a></li>
            </ul>
        </li>
				<li>
            <a href="#fonctionnalités">Fonctionnalités</a>
        </li>
  </ol>
</details>
<br/>

### Structure de la messagerie

#### Composants

La messagerie est divisée en 3 composants :
- un template pour l'objet "message"
- un template pour l'objet "date"
- un composant pour la gestion de l'envoi, l'affichage de messages et autres fonctionnalités permettant à la messagerie de fonctionner



#### Modèles

Le premier modèle `model.ts` regroupe les informations envoyées dans la base de données lors de l'envoi d'un message : 
```ts
export class MessageModel {
	auteur!: string;
	contenu!: string;
	horodatage!: number;
	newDay!: boolean;
	nom!: string;
	prenom!: string;
}
```
>Les champs `nom` et `prénom` sont récupérés dans la base de donnée à partir de l'auteur, qui est contenu dans le cache du navigateur (localStorage).  
>Le champ `newDay` est un booléen indiquant si le message envoyé est le premier du jour ou non. Il permet d'afficher la date du jour au début d'une conversation qui aurait lieu un nouveau jour.
  
Le second regroupe les informations dont l'application a besoin pour afficher les messages correctement :
```ts
export class MessageInfos {
	message!: MessageModel;
	authorIsMe!: boolean;
	isBot!: boolean;

	constructor() {
		this.message = new MessageModel();
	}
}
```
>Les champs `authorIsMe` et `isBot` servent à déterminer l'auteur d'un message et à modifier le CSS selon les cas. Voici les règles établies pour ces champs :
>- je suis auteur du message : message en vert, affiché à droite
>- je ne suis pas auteur : message en gris, affiché à gauche
>- l'auteur du message est un bot : message ne violet, affiché a gauche

![Exemple de messages](./img/messages_example.png)

### Messages

### Canaux

### Fonctionnalités