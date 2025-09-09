# Portfolio BTS SIO SISR

Une page d'accueil moderne et responsive en HTML5/CSS/JS pour présenter votre profil (À propos, Compétences et Contact) avec thème clair/sombre, navigation mobile et animations.

## Démarrage

Ouvrez `index.html` dans votre navigateur. Aucun build n'est nécessaire.

## Personnalisation rapide

- Remplacez "Votre Nom" dans `index.html`.
- Mettez votre email dans le bouton Contact.
- Changez la photo de profil dans `assets/css/style.css` (propriété `background` de `.about .avatar`).
- Ajoutez/éditez des compétences en dupliquant une `skill-card` dans la section Compétences.

## Rédiger vos Projets (E6-ready)

Les cartes se trouvent dans `index.html` (section `#projets`) mais le détail affiché dans la modale est alimenté par un tableau dans `assets/js/main.js` (const `projects`). Pour chaque projet, remplissez les champs:

- `id`, `title`, `context`
- `contexte`, `objectif`
- `architecture` (liste)
- `actions`, `securite`, `resultats`, `evidence` (listes)
- `tags` (ex: E5/E6, SISR, Réseau, Sécurité)
- `doc` (lien vers doc complète: schéma, conf, captures)

Les fiches sont pensées pour correspondre à la “Fiche descriptive de réalisation professionnelle” (E6, annexe 9-1A).

## Structure

- `index.html` — Accueil, À propos, Compétences, Contact
- `assets/css/style.css` — Thème, layout, animations
- `assets/js/main.js` — Menu mobile, thème, animations au scroll


