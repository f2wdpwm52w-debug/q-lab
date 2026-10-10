# Q-LAB V1.0 — Quantum Computing Studio

Simulateur pédagogique de calcul quantique : simulateur principal, éditeur de circuits, téléportation, Grover, BB84, correction d’erreurs et démonstration classique de Shor.

## Installation

```bash
npm install
npm run build
```

Déploiement : importer les fichiers **à la racine** du dépôt GitHub, sans dossier parent `q-lab-v1-final`. Vercel utilise Vite.

## Portée scientifique

Simulations classiques idéalisées, sans exécution sur matériel quantique. La clé BB84 affichée est pédagogique et non sécurisée. La démonstration de Shor calcule la période classiquement.

## Version 1.0

- Conservation des sept modules et de leurs fonctionnalités.
- Intégration des correctifs BB84, correction d’erreurs, éditeur de circuits et sphère de Bloch.
- Harmonisation légère des styles et de l’accessibilité, sans changement des algorithmes.
- Suppression des copies obsolètes de `vite.config.js`.
