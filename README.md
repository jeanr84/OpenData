Challenge Open Data
======

Jean Robin - Lacroix Adrien - Laporte Laura - Renouvin Guillaume

## Sources de données

* [Données sur le chômage](http://www.bdm.insee.fr/bdm2/choixCriteres?codeGroupe=713)
* [Données d’immigration](http://www.insee.fr/fr/themes/tableau.asp?reg_id=99&ref_id=TCRD_012)
* [Données sur le revenu médian](http://www.insee.fr/fr/themes/detail.asp?reg_id=99&ref_id=revenu-pauvrete-menage)
* [Résultats du tour 1 pour les élections départementales 2015](https://www.data.gouv.fr/fr/datasets/elections-departementales-2015-resultats-tour-1/)

## Pré-requis

Afin de faire fonctionner l'application et le serveur, il est nécessaire d'avoir NodeJS installé sur son ordinateur.

### OSX

```sh
brew install nodejs
```

### Linux

```sh
sudo apt-get install nodejs npm
```

## Initialisation de la base de données

La base de données utilisée est MongoDB. Pour remplir la base, lancer le script suivant

```sh
./initMongo.sh
```

## Mise en place du serveur fournissant l'API


### Installation des dépendances

```sh
npm install -g express-generator@4

cd ./src/server_api

npm install
```

### Lancement du serveur

```sh
./bin.www
```

### Accès à l'application Web

### Installation des dépendances

```sh
npm install -g grunt-cli
npm install -g bower

cd ./src/webapp

npm install
bower install
```

### Visualisation

```sh
$ grunt serve
```
Se rendre sur http://localhost:9000/src/index.html

### Version Release

```sh
$ grunt demo
```
Le tout se trouvera dans le dossier `demo`