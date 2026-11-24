# ⛵ La Rabouilleuse — Démonstrateur Compagnon de Loire (PWA)

Prototype autonome, mobile-first et installable en PWA, conçu pour être présenté au **Conseil d'Administration** et aux **adhérents** de **La Rabouilleuse – École de Loire** (Rochecorbon).

- **🌐 Version en ligne (GitHub Pages)** : **https://krieknini-hue.github.io/la-rabouilleuse/**

> Ce dossier est totalement indépendant de l'application du Collectif Tombola (`webapp/`).

---

## 🚀 Lancer le démonstrateur en local

Depuis la racine du dépôt :

```bash
node demo-rabouilleuse/server.js
```

Puis ouvrir dans un navigateur (ordinateur ou smartphone sur le même réseau) :
- **http://localhost:3002**

*(Port personnalisable via `PORT=3005 node demo-rabouilleuse/server.js`)*

---

## 🧭 Guide de démonstration pour le CA

En haut à droite de l'application, un sélecteur permet de basculer instantanément entre deux vues :
1. **👤 Visiteur** (grand public / passagers) : consultation météo & Loire, réservation de balades au tarif public, galerie photo et infos pratiques.
2. **⚓ Adhérent** (membres / bénévoles / CA) : modification en direct du bandeau « Info flash embarquement », tarifs adhérents sur les balades, inscription aux formations/chantiers, ajout d'une date au planning et dépôt de photos dans l'album.

### Ce qui est en temps réel vs simulé dans cette V1
- **Données réelles en direct (sans clé API)** :
  - **Hauteur d'eau & débit de la Loire** via l'API officielle **Hub'Eau Hydrométrie v2** (Tours – Pont Mirabeau, ainsi que la cascade amont : Gien, Orléans, Onzain).
  - **Météo fluviale & 7 jours** (température, vent, rafales, direction, lever/coucher du soleil) via **Open-Meteo**.
  - **Tendances hydrologiques 7 à 30 jours** (débit `m³/s` et enveloppe min–max) via **Open-Meteo Flood / Copernicus GloFAS** (maille Loire à Rochecorbon).
- **Données simulées localement (`localStorage` du navigateur)** :
  - Planning des activités, réservations de balades, édition du bandeau flash et ajout de photos dans l'album (tout est réinitialisable via le bouton `ℹ️ Démo`).
  - Export **`.ics`** fonctionnel pour ajouter n'importe quelle activité à l'agenda du téléphone.

---

## 🛠️ Pistes d'intégration si le CA valide le projet
1. **Planning & billetterie** : connexion à l'agenda existant (flux iCal/Google Calendar) et/ou liens directs vers les créneaux **HelloAsso**.
2. **Album & vie associative** : ajout d'une base **Supabase** (comme sur l'app Tombola) pour synchroniser les annonces flash, les coups de main chantiers et modérer les photos partagées.
3. **Hébergement** : déploiement statique gratuit sur **GitHub Pages** (avec repli hors-ligne via Service Worker).
