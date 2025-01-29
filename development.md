# Développement


## Intro

Installer les dépendences JavaScript

```
npm install
```


## Mettre à jour les termes

1. S'assurer que le [tableau Google](https://docs.google.com/spreadsheets/d/1dqE80fhoNQCfVtrC0NTNSjyYPEhbYM8k9XnzYg_ClqQ/edit?usp=sharing) est à jour

2. Exporter ce document en CSV dans le document `data/data.csv`

3. Convertir le CSV pour le projet :

    a. Convertir le CSV

    ```
    npm run convert:csv
    ```

    b. Copier le nouvel objet JSON créé dans `src/data/data.json` vers `public/scripts/bingo-data.js`  
    (TODO: créer tâche pour ne pas faire cette étape)


## Compiler le code JavaScript

1. Modifier le code au besoin dans `src/scripts/bingo.js`

2. Compiler les changements avec le script `npm run parcel`  
(TODO: créer tâche pour compiler automatiquement lors de changements)


## Publier changements

Tout *commit* publié sur la branche *main* du projet est automatiquement publié sur le site web.
