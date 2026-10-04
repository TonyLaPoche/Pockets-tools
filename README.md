# Pocket Tools

Index installable des mini-apps publiques d’[Antoine Terrade](https://github.com/TonyLaPoche).

Chaque fiche ouvre l’app et le dépôt. La recherche, les filtres et les favoris tournent dans le navigateur : les étoiles sont enregistrées dans `localStorage`, sur l’appareil.

## Ajouter une app

Une entrée dans `src/tools.ts` suffit. Les groupes possibles sont dans `GROUPS` : Outils, Médias, Apprendre, Pro, Jeu, 18+.

## Lancer

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173/Pockets-tools/`.

## Déployer sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` publie `dist/` à chaque push sur `main`.

Une fois, dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Adresse : `https://tonylapoche.github.io/Pockets-tools/`
