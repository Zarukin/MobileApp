# Todos

Todos est une application de gestion de listes et de tâches. Cette application permet :
- Création de liste
- Création de tâches dans une liste
- Suppression de listes
- Suppression de tâches
- Partage de listes
- Modification de tâches
- Modification de listes
- Changer la couleur d'une liste
- Connexion avec courriel et mot de passe
- Connexion avec un fournisseur externe
- Lier plusieurs fournisseurs à un compte
- Modification du courriel
- Date d'échéance pour les tâches
- Ajout d'évènement sur un calendrier
- Règles de sécurité Firestore
- Panel de gestion de partage
- Reconnaissance vocale
- Recherche textuelle

## Connexion

La création d'un compte est obligatoire pour utiliser Todos. Celui-ci permet de synchroniser ses listes dans le nuage et de pouvoir y accéder de partout. Il est possible de créer un compte Todos avec un courriel et un mot de passe. L'application laisse la possibilité de se connecter avec un fournisseur externe. La liste des fournisseurs pris en charge est la suivante :
- Google
- Facebook
- Twitter
- Github

## Fonctionnalités de base

La création de listes et de tâches est au centre de cette application. Un bouton en bas à droite permet d'en créer. Une nouvelle fenêtre va s'ouvrir et demander les informations nécessaires pour la création. 

Les listes et les tâches peuvent bien évidemment être supprimées. Pour cela il suffit de faire glisser un élément vers la gauche pour afficher un bouton de suppression.

Le nom ainsi que la couleur de la liste peuvent être modifiés en faisant glisser celle-ci vers la droite. Une tâche est modifiable en cliquant dessus.

Il est aussi possible de rechercher une liste ou une tâche grâce à la barre de recherche présent sur la page d'accueil.

## Reconnaissance vocale

Un bouton « micro » est présent en bas à gauche sur la page d'accueil et sur la page de liste des tâches. Celui-ci déclenche une reconnaissance vocale qui permet d'exécuter plusieurs fonctions :

- Créer une liste
> *crée/ajoute une liste de nom [NOM]*
- Créer une tâche
> *crée/ajoute une tâche de nom [NOM]*
- Lire les listes
> *lis mes listes*
- Lire les tâches
> *lis mes tâches*
- Afficher une liste 
> *affiche/montre ma liste de nom [NOM]*
- Afficher une tâche
> *affiche/montre ma tâche de nom [NOM]*

Ces commandes restent tout de même un peu permissive, seuls les mots-clés « crée », « ajoute », « liste », « tâche », « affiche », « montre », « nom » et « lis mes ». Cette fonctionnalité n'est disponible que sur Android.

## Partage de listes

Chaque liste peut être partagé en cliquant sur le bouton « partage » en haut à gauche de la page de détail de la liste. Ce bouton ouvre une nouvelle fenêtre qui permet de renter un courriel et une option de partage (lecture ou écriture) afin de partager la liste avec un autre utilisateur. Une section permet également de gérer les utilisateurs avec lesquels la liste à déjà été partagée.

Un utilisateur peut à tout moment supprimé une liste qui a été partagé avec lui, ceci n'affectera pas la liste en elle-même mais retirera simplement l'utilisateur de la liste de partage de cette-dernière.

## Intégration du calendrier

Il est possible de définir une date d'échéance pour chaque tâche. Il devient alors facile d'ajouter un évènement sur le calendrier par défaut du téléphone directement depuis l'application. Pour cela un bouton « Créer un évènement » est accessible depuis la page de détail de la tâche. Cette fonctionnalité n'est disponible que sur Android.

## Astuce

Essayez de créer une liste avec pour nom « iwanttoplaytheflags » ;)

## Plugins implémentés

- [PhoneGap Calendar plugin](https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin)
- [Capacitor Speech Recognition Plugin](https://github.com/capacitor-community/speech-recognition) (corrigé manuellement)
- [Text to Speech](https://github.com/capacitor-community/text-to-speech)
- [capacitor-firebase-auth](https://github.com/baumblatt/capacitor-firebase-auth)