<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Supply Chain Risk Assessor

Frontend MVP for supply chain risk assessment built with React + TypeScript + Vite.

This repository contains a demo SPA that visualizes suppliers, risk alerts and scenarios using mock JSON data.

How to run

```bash
npm install
npm run dev
# open http://localhost:5173 (or the port Vite chooses)
```

Notes
- Uses Tailwind CSS for styling and Recharts / Leaflet for visualizations.
- Data lives in `src/data/*.json` and is served by `src/utils/api.ts` (simulated delays).

License
MIT
