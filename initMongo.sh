#!/bin/bash

mongo << 'EOF'
use openData
db.dropDatabase()
EOF

java -jar parser.jar res/data/regionales/csv/Reg_15_Resultats_Communes_T1.csv res/data/departements/populationDepartements.csv

mongoimport --db openData --collection chomages --type csv --file res/data/chomage/chomage.csv --fields departement,tauxChomage

mongoimport --db openData --collection nomlistes --file res/data/nomListes/nomListe.json

mongoimport --db openData --collection regionsavecdepartements --file res/data/regionsDepartements.json

mongoimport --db openData --collection immigrationregions --type csv --file res/data/immigration/immigrationRegions.csv --fields _id,nbImmigres,poucentageImmigres

mongoimport --db openData --collection immigrationdepartements --type csv --file res/data/immigration/immigrationDepartements.csv --fields _id,nbImmigres,poucentageImmigres

mongoimport --db openData --collection naissancesdepartements --type csv --file res/data/naissances/naissancesDepartements.csv --fields _id,nbNaissances

mongoimport --db openData --collection revenudepartements --type csv --file res/data/revenuMedian/revenuMedianDepartements.csv --fields _id,revenuMedian

mongoimport --db openData --collection revenuregions --type csv --file res/data/revenuMedian/revenuMedianRegions.csv --fields _id,revenuMedian
