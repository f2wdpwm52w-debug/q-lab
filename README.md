# Q-LAB V0.1

Simulateur quantique monoparticule (1 qubit) local, responsive, sans backend.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir l'URL affichée par Vite. Pour produire une version statique : `npm run build` (dossier `dist/`).

## Fonctions

- État complexe à deux amplitudes, portes X/Y/Z/H/S/T/RY(π/4).
- Historique de portes, probabilités, vecteur de Bloch, projection X-Z.
- 1000 mesures simulées selon la règle de Born.
- Réinitialisation |0⟩.

## Limites

Pas de processeur quantique réel, pas de circuit multi-qubits, pas de sauvegarde cloud. Les 1000 mesures sont des tirages indépendants et ne modifient pas l'état du simulateur. La sphère représente uniquement une projection X-Z.
