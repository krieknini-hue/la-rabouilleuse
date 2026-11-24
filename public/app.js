(() => {
  'use strict';

  const STORAGE_KEY = 'rabouilleuse_demo_v3';
  const ROCHECORBON_LAT = 47.413;
  const ROCHECORBON_LON = 0.755;

  const CASCADE_STATIONS = [
    { code: 'K418001010', name: 'Gien', delay: '~48 h amont', isTarget: false },
    { code: 'K435001010', name: 'Orléans', delay: '~32 h amont', isTarget: false },
    { code: 'K480001002', name: 'Onzain (Chaumont)', delay: '~10 h amont', isTarget: false },
    { code: 'K490003010', name: 'Tours (Pont Mirabeau)', delay: 'Réf. Rochecorbon', isTarget: true }
  ];

  // Utilitaires de dates relatives pour que la démo reste toujours fraîche
  function addDaysIso(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateFr(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dt);
  }

  function formatShortDay(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(dt);
  }

  const CUSTOM_FORMULAS = {
    'custom-decouverte': {
      id: 'custom-decouverte',
      title: 'Balade Découverte (1h30)',
      subtitle: 'Départs habituels à 10h30, 14h ou 16h • Ponton du Bateau-Lavoir (Rochecorbon)',
      priceAdult: 20,
      priceMember: 15,
      priceChild: 12,
      defaultAdults: 2
    },
    'custom-crepuscule': {
      id: 'custom-crepuscule',
      title: 'Balade Crépusculaire (2h30)',
      subtitle: '19h30 (1–15 mai), 19h (16 mai–15 août), 18h30 (16 août–30 sept.) • Pique-nique à partager recommandé',
      priceAdult: 36,
      priceMember: 25,
      priceChild: 16,
      defaultAdults: 2
    }
  };

  function createDefaultState() {
    return {
      role: 'visitor',
      flash: {
        text: 'En période de basses eaux, le départ des balades s’effectue au Bateau-Lavoir (56 quai de la Loire, centre de Rochecorbon, en contrebas de la place de la Lanterne). Ouverture vendredi et samedi de 17h30 à 22h30.',
        updatedAt: 'Site officiel • La Rabouilleuse'
      },
      activities: [
        {
          id: 'agenda-2026-04-26',
          type: 'dimanche',
          title: 'Dimanche de la Rabouilleuse — Ornithologie',
          date: '2026-04-26',
          time: '18:30',
          endTime: '21:00',
          durationMin: 150,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Julien Present, chargé d’étude à la LPO (Ligue pour la Protection des Oiseaux). Durée 2h30, prévoir pique-nique à partager.'
        },
        {
          id: 'agenda-2026-05-30',
          type: 'evenement',
          title: 'Inauguration du Bateau-Lavoir',
          date: '2026-05-30',
          time: '16:00',
          endTime: '22:00',
          durationMin: 360,
          place: '56 quai de la Loire, Sur la Loire — Rochecorbon',
          capacity: 200,
          booked: 0,
          priceAdult: 0,
          priceMember: 0,
          priceChild: 0,
          openAccess: true,
          priceLabel: 'Accès libre • Après-midi & soirée festive',
          description: 'Ateliers de sérigraphie et linogravure (venez avec votre linge à sérigraphier !), concerts et spectacle.'
        },
        {
          id: 'agenda-2026-05-31',
          type: 'dimanche',
          title: 'Dimanche de La Rabouilleuse — Chiroptères',
          date: '2026-05-31',
          time: '19:00',
          endTime: '22:00',
          durationMin: 180,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Amélie Beillard (LPO). Balade en bateau à thème à la tombée du jour, prévoir pique-nique à partager.'
        },
        {
          id: 'agenda-2026-06-28',
          type: 'dimanche',
          title: 'Dimanche de La Rabouilleuse — Sédimentation : Le chant du sable',
          date: '2026-06-28',
          time: '19:30',
          endTime: '22:30',
          durationMin: 180,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Jules Le Guern (Université de Tours). Comprendre la dynamique du sable et du fleuve, pique-nique à partager.'
        },
        {
          id: 'agenda-2026-06-30',
          type: 'evenement',
          title: 'Concerts avec La Guilde de la transmission',
          date: '2026-06-30',
          time: '18:30',
          endTime: '22:00',
          durationMin: 210,
          place: 'Bateau-Lavoir (56 quai de la Loire, Rochecorbon)',
          capacity: 150,
          booked: 0,
          priceAdult: 0,
          priceMember: 0,
          priceChild: 0,
          openAccess: true,
          priceLabel: 'Prix libre et conscient',
          description: 'Soirée concerts avec Hurkle-Durkle (Irish Scent) et Yaadhava (Rajasthani transe).'
        },
        {
          id: 'agenda-2026-07-04',
          type: 'evenement',
          title: 'Escale de Nat’explorers : Loire Sentinelle',
          date: '2026-07-04',
          time: '18:30',
          endTime: '21:00',
          durationMin: 150,
          place: 'Bateau-Lavoir (56 quai de la Loire, Rochecorbon)',
          capacity: 120,
          booked: 0,
          priceAdult: 0,
          priceMember: 0,
          priceChild: 0,
          openAccess: true,
          priceLabel: 'Rencontre ouverte • Accès libre',
          externalUrl: 'https://www.natexplorers.fr/agenda/',
          description: 'Exploration scientifique et sensible du fleuve Loire : rencontre avec l’équipage au Bateau-Lavoir.'
        },
        {
          id: 'agenda-2026-07-18',
          type: 'evenement',
          title: 'Spectacle de la compagnie Wonderkaline',
          date: '2026-07-18',
          time: '17:30',
          endTime: '19:30',
          durationMin: 120,
          place: 'Bateau-Lavoir (56 quai de la Loire, Rochecorbon)',
          capacity: 120,
          booked: 0,
          priceAdult: 0,
          priceMember: 0,
          priceChild: 0,
          openAccess: true,
          priceLabel: 'Spectacle au Bateau-Lavoir',
          description: 'Rendez-vous artistique sur les bords de Loire au Bateau-Lavoir.'
        },
        {
          id: 'agenda-2026-07-21',
          type: 'evenement',
          title: 'Concert d’Umlaut Bigband',
          date: '2026-07-21',
          time: '19:00',
          endTime: '22:00',
          durationMin: 180,
          place: 'Au Peliau St-Georges, La Rabouilleuse — Rochecorbon',
          capacity: 180,
          booked: 0,
          priceAdult: 0,
          priceMember: 0,
          priceChild: 0,
          openAccess: true,
          priceLabel: 'Entrée à prix libre (10–15 € prix conseillé)',
          description: 'Grand concert estival en plein air au Peliau Saint-Georges.'
        },
        {
          id: 'agenda-2026-07-26',
          type: 'dimanche',
          title: 'Dimanche de La Rabouilleuse — Histoire locale',
          date: '2026-07-26',
          time: '19:30',
          endTime: '22:00',
          durationMin: 150,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Claude Metavant (historien de Rochecorbon) : « Comment l’humain s’est-il implanté sur la Loire ? ». Prévoir pique-nique à partager.'
        },
        {
          id: 'agenda-2026-08-30',
          type: 'dimanche',
          title: 'Dimanche de La Rabouilleuse — Baignade vs Libellules',
          date: '2026-08-30',
          time: '19:00',
          endTime: '21:30',
          durationMin: 150,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Renaud Baeta (Bureau d’Études CAUDALIS). Prévoir pique-nique à partager.'
        },
        {
          id: 'agenda-2026-09-27',
          type: 'dimanche',
          title: 'Dimanche de La Rabouilleuse — Zooarchéologie',
          date: '2026-09-27',
          time: '18:00',
          endTime: '21:00',
          durationMin: 180,
          place: 'La Rabouilleuse École de Loire (parking St-Georges, Rochecorbon)',
          capacity: 24,
          booked: 0,
          priceAdult: 36,
          priceMember: 25,
          priceChild: 16,
          openAccess: false,
          description: 'Avec Marie-Pierre Roué-Horard (MSH – Maison des Sciences et des Humanités). Prévoir pique-nique à partager.'
        }
      ],
      bookings: [],
      photos: [
        {
          id: 'ph-1',
          src: './img/toue-loire.jpg',
          title: 'Sous voile carrée devant les coteaux de Rochecorbon',
          category: 'navigation',
          author: 'Équipe La Rabouilleuse',
          dateLabel: 'Saison Loire',
          likes: 18,
          liked: false
        },
        {
          id: 'ph-2',
          src: './img/crepuscule-loire.jpg',
          title: 'Reflets dorés au crépuscule sur le chenal',
          category: 'ambiance',
          author: 'Camille',
          dateLabel: 'Sortie soir',
          likes: 24,
          liked: false
        },
        {
          id: 'ph-3',
          src: './img/faune-loire.jpg',
          title: 'Héron cendré dans la brume du matin',
          category: 'faune',
          author: 'Pascal',
          dateLabel: 'Balade aube',
          likes: 15,
          liked: false
        },
        {
          id: 'ph-4',
          src: './img/chantier-bois.jpg',
          title: 'Charpente traditionnelle et rabots à l’atelier',
          category: 'chantier',
          author: 'Collectif chantier',
          dateLabel: 'Atelier bois',
          likes: 12,
          liked: false
        }
      ]
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const def = createDefaultState();
      return {
        role: parsed.role === 'member' ? 'member' : 'visitor',
        flash: parsed.flash && parsed.flash.text ? parsed.flash : def.flash,
        activities: Array.isArray(parsed.activities) && parsed.activities.length ? parsed.activities : def.activities,
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
        photos: Array.isArray(parsed.photos) && parsed.photos.length ? parsed.photos : def.photos
      };
    } catch {
      return createDefaultState();
    }
  }

  let state = loadState();
  let activeTab = 'loire';
  let planningFilter = 'all';
  let albumFilter = 'all';
  let glofasHorizon = 7;
  let glofasCache = null;
  let currentLightboxPhotoId = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota localStorage éventuel
    }
  }

  // Toast discret
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 3200);
  }

  // Gestion des modales <dialog> (conforme modern-web-guidance)
  function openModal(id) {
    const dlg = document.getElementById(id);
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
  }

  function closeModal(id) {
    const dlg = document.getElementById(id);
    if (dlg && dlg.open) dlg.close();
  }

  function initDialogs() {
    const dialogs = document.querySelectorAll('dialog.modal-dialog');
    const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;

    dialogs.forEach((dialog) => {
      dialog.addEventListener('close', () => {
        dialog.returnValue = '';
      });

      // Fallback Safari/anciens navigateurs pour closedby="any"
      if (!supportsClosedBy && dialog.getAttribute('closedby') === 'any') {
        let pressedOutside = false;
        const outside = (e) => {
          const r = dialog.getBoundingClientRect();
          return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        };
        dialog.addEventListener('pointerdown', (e) => {
          pressedOutside = outside(e);
        });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e)) dialog.close();
          pressedOutside = false;
        });
      }
    });

    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(btn.getAttribute('data-close-dialog'));
      });
    });
  }

  // Validation accessible après interaction (conforme modern-web-guidance: validate-input-after-interaction)
  function initAccessibleValidation() {
    const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
    const dirtyState = new WeakMap();
    const flagged = new WeakSet();
    const announced = new WeakSet();
    let announceTimer;
    let announcedField;

    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('visually-hidden');
    document.body.append(announcer);

    const linkError = (input, shown) => {
      const errorId = input.dataset.error;
      if (!errorId) return;
      const ids = (input.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) input.setAttribute('aria-describedby', ids.join(' '));
      else input.removeAttribute('aria-describedby');
    };

    const spokenText = (node) => {
      const copy = node.cloneNode(true);
      copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
      copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
        n.replaceWith(`${n.getAttribute('aria-label')}: `);
      });
      return copy.textContent.replace(/\s+/g, ' ').trim();
    };

    const announceError = (el) => {
      const error = el.dataset.error ? document.getElementById(el.dataset.error) : null;
      if (!error) return;
      const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : '';
      clearTimeout(announceTimer);
      announcer.textContent = '';
      announcedField = el;
      announceTimer = setTimeout(() => {
        announcer.textContent = label + spokenText(error);
      }, 500);
    };

    const syncAria = (el, announce = false) => {
      if (!el.matches?.('input, select, textarea')) return;
      let isInvalid = false;
      if (supportsUserInvalid) {
        isInvalid = el.matches(':user-invalid');
      } else {
        isInvalid = el.classList.contains('user-invalid-fallback');
      }

      if (isInvalid) {
        if (announce && !announced.has(el)) {
          announceError(el);
          announced.add(el);
        }
        el.setAttribute('aria-invalid', 'true');
        linkError(el, true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el) {
          clearTimeout(announceTimer);
          announcer.textContent = '';
        }
      }
    };

    const updateFallbackState = (input, announce = false) => {
      const isValid = input.validity.valid;
      input.classList.toggle('user-invalid-fallback', !isValid);
      input.classList.toggle('user-valid-fallback', isValid);
      syncAria(input, announce);
    };

    document.querySelectorAll('form input, form select, form textarea').forEach((el) => {
      if (!el.hasAttribute('aria-invalid')) el.setAttribute('aria-invalid', 'false');
      syncAria(el);
    });

    if (!supportsUserInvalid) {
      document.addEventListener('blur', (e) => {
        const input = e.target;
        if (!input.checkValidity) return;
        const st = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        st.hasBlurred = true;
        dirtyState.set(input, st);
        if (st.hasInteracted) updateFallbackState(input, true);
      }, true);

      document.addEventListener('input', (e) => {
        const input = e.target;
        if (!input.checkValidity) return;
        const st = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        st.hasInteracted = true;
        dirtyState.set(input, st);
        if (st.hasBlurred) updateFallbackState(input, false);
      });

      document.addEventListener('change', (e) => {
        const input = e.target;
        if (!input.checkValidity) return;
        const st = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        st.hasInteracted = true;
        dirtyState.set(input, st);
        if (st.hasBlurred) updateFallbackState(input, true);
      });

      document.addEventListener('invalid', (e) => {
        const input = e.target;
        if (!input.checkValidity) return;
        dirtyState.set(input, { hasInteracted: true, hasBlurred: true });
        announced.add(input);
        updateFallbackState(input, false);
      }, true);
    } else {
      document.addEventListener('blur', (e) => syncAria(e.target, true), true);
      document.addEventListener('input', (e) => {
        if (e.target.hasAttribute('aria-invalid')) syncAria(e.target);
      });
      document.addEventListener('change', (e) => syncAria(e.target, true), true);
      document.addEventListener('invalid', (e) => {
        announced.add(e.target);
        syncAria(e.target);
      }, true);
    }

    document.addEventListener('reset', (e) => {
      setTimeout(() => {
        if (!e.target.elements) return;
        for (const el of e.target.elements) {
          dirtyState.delete(el);
          el.classList.remove('user-invalid-fallback', 'user-valid-fallback');
          flagged.delete(el);
          announced.delete(el);
          if (el.matches?.('input, select, textarea')) {
            el.setAttribute('aria-invalid', 'false');
            linkError(el, false);
          }
        }
      });
    }, true);
  }

  // Navigation par onglets
  function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.hidden = panel.id !== `tab-${tabName}`;
    });
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Rôle Visiteur / Adhérent
  function applyRoleUI() {
    const isMember = state.role === 'member';
    document.getElementById('role-visitor-btn').setAttribute('aria-pressed', String(!isMember));
    document.getElementById('role-member-btn').setAttribute('aria-pressed', String(isMember));

    document.querySelectorAll('.member-only').forEach((el) => {
      el.hidden = !isMember;
    });

    const albumHint = document.getElementById('album-member-hint');
    if (albumHint) albumHint.hidden = isMember;

    const subtitle = document.getElementById('planning-subtitle');
    if (subtitle) {
      subtitle.textContent = isMember
        ? 'Mode Adhérent actif : tarifs préférentiels, chantiers participatifs et ajout d’activités.'
        : 'Réservez votre balade sur la Loire ou ajoutez les dates à votre agenda.';
    }

    renderActivities();
  }

  // Bandeau Info Flash
  function renderFlash() {
    document.getElementById('flash-message-text').textContent = state.flash.text;
    document.getElementById('flash-updated-at').textContent = state.flash.updatedAt;
  }

  // =========================================================================
  // DONNEES TEMPS REEL : METEO (Open-Meteo), LOIRE (Hub'Eau), GLOFAS (Flood)
  // =========================================================================

  function wmoToFrench(code) {
    if (code === 0) return { icon: '☀️', label: 'Ciel dégagé' };
    if (code === 1 || code === 2) return { icon: '⛅', label: 'Peu nuageux' };
    if (code === 3) return { icon: '☁️', label: 'Couvert' };
    if (code === 45 || code === 48) return { icon: '🌫️', label: 'Brume / brouillard' };
    if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Bruine' };
    if (code >= 61 && code <= 67) return { icon: '🌧️', label: 'Pluie' };
    if (code >= 71 && code <= 77) return { icon: '❄️', label: 'Neige' };
    if (code >= 80 && code <= 82) return { icon: '🌦️', label: 'Averses' };
    if (code >= 95) return { icon: '⛈️', label: 'Risque d’orage' };
    return { icon: '🌤️', label: 'Variable' };
  }

  function degToCompass(deg) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'];
    const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
    return { cardinal: dirs[idx], arrow: arrows[idx] };
  }

  function getSailCondition(windKmh, gustsKmh) {
    if (gustsKmh >= 45 || windKmh >= 30) return { text: 'Fortes rafales', cls: 'badge-red' };
    if (gustsKmh >= 32 || windKmh >= 22) return { text: 'Vent soutenu', cls: 'badge-amber' };
    if (windKmh >= 9) return { text: 'Idéal voile carrée', cls: 'badge-green' };
    return { text: 'Calme / aviron', cls: 'badge-blue' };
  }

  function getRiverNavBadge(heightMeters) {
    if (heightMeters < 0.5) return { text: 'Étiage / bancs de sable', cls: 'badge-amber' };
    if (heightMeters <= 1.6) return { text: 'Niveau favorable', cls: 'badge-green' };
    if (heightMeters <= 2.6) return { text: 'Eaux hautes / courant', cls: 'badge-amber' };
    return { text: 'Vigilance crue', cls: 'badge-red' };
  }

  function formatHeightMeters(mm) {
    if (mm === null || mm === undefined || Number.isNaN(mm)) return '-- m';
    const meters = mm / 1000;
    return `${meters.toFixed(2).replace('.', ',')} m`;
  }

  function formatFlowM3s(lPerSec) {
    if (lPerSec === null || lPerSec === undefined || Number.isNaN(lPerSec)) return '-- m³/s';
    const m3s = Math.round(lPerSec / 1000);
    return `${m3s} m³/s`;
  }

  function formatHourFr(isoTimestamp) {
    if (!isoTimestamp) return '';
    const d = new Date(isoTimestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  async function loadWeather() {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${ROCHECORBON_LAT}&longitude=${ROCHECORBON_LON}` +
      `&timezone=Europe%2FParis` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,precipitation_probability_max,sunrise,sunset` +
      `&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo HTTP ' + res.status);
    const data = await res.json();

    const cur = data.current;
    const wmo = wmoToFrench(cur.weather_code);
    const comp = degToCompass(cur.wind_direction_10m);
    const wind = Math.round(cur.wind_speed_10m);
    const gusts = Math.round(cur.wind_gusts_10m);
    const sail = getSailCondition(wind, gusts);

    document.getElementById('weather-current-icon').textContent = wmo.icon;
    document.getElementById('weather-current-temp').textContent = `${Math.round(cur.temperature_2m)} °C`;
    document.getElementById('weather-current-desc').textContent =
      `${wmo.label} • ressenti ${Math.round(cur.apparent_temperature)} °C`;
    document.getElementById('weather-current-wind').textContent = `${wind} km/h (raf. ${gusts})`;
    document.getElementById('weather-current-dir').textContent = `${comp.arrow} ${comp.cardinal} (${Math.round(cur.wind_direction_10m)}°)`;

    const sunrise = data.daily?.sunrise?.[0] ? data.daily.sunrise[0].slice(11, 16) : '--:--';
    const sunset = data.daily?.sunset?.[0] ? data.daily.sunset[0].slice(11, 16) : '--:--';
    document.getElementById('weather-sun-times').textContent = `${sunrise} / ${sunset}`;

    const badgeEl = document.getElementById('sail-condition-badge');
    badgeEl.textContent = sail.text;
    badgeEl.className = `sail-badge ${sail.cls}`;

    const compassArrow = document.getElementById('wind-compass-arrow');
    if (compassArrow) {
      // Vent provenant de `wind_direction_10m` : l'aiguille pointe vers où souffle le vent (+180°)
      const blowDir = (Math.round(cur.wind_direction_10m) + 180) % 360;
      compassArrow.setAttribute('transform', `rotate(${blowDir} 20 20)`);
    }

    const heroWeather = document.getElementById('hero-weather-pill');
    if (heroWeather) {
      heroWeather.textContent = `${wmo.icon} ${Math.round(cur.temperature_2m)} °C • Vent ${wind} km/h ${comp.cardinal}`;
    }

    // 7 jours
    const list = document.getElementById('weather-7d-list');
    list.innerHTML = '';
    const d = data.daily;
    for (let i = 0; i < d.time.length; i++) {
      const dayWmo = wmoToFrench(d.weather_code[i]);
      const dayComp = degToCompass(d.wind_direction_10m_dominant[i]);
      const row = document.createElement('div');
      row.className = 'forecast-row';
      row.innerHTML = `
        <span class="forecast-day">${i === 0 ? "Aujourd'hui" : formatShortDay(d.time[i])}</span>
        <span aria-label="${dayWmo.label}" title="${dayWmo.label}">${dayWmo.icon}</span>
        <span class="forecast-temps">${Math.round(d.temperature_2m_max[i])}° <span class="t-min">/ ${Math.round(d.temperature_2m_min[i])}°</span></span>
        <span class="forecast-wind">💨 ${Math.round(d.wind_speed_10m_max[i])}–${Math.round(d.wind_gusts_10m_max[i])} km/h ${dayComp.cardinal}</span>
        <span class="forecast-rain">💧 ${d.precipitation_probability_max[i] ?? 0}%</span>
      `;
      list.appendChild(row);
    }
  }

  async function fetchHubEauLatest(code, grandeur, extraParams = '') {
    const url = `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=${code}&grandeur_hydro=${grandeur}&size=1&sort=desc${extraParams}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data && json.data.length ? json.data[0] : null;
  }

  function render72hChart(seriesMm) {
    const container = document.getElementById('chart-72h-container');
    if (!seriesMm || seriesMm.length < 2) {
      container.innerHTML = '<div class="skeleton-box">Pas assez de points sur les 72 dernières heures.</div>';
      return;
    }

    // Ré-échantillonnage ~72 points chronologiques
    const sorted = [...seriesMm].sort((a, b) => new Date(a.date_obs) - new Date(b.date_obs));
    const step = Math.max(1, Math.floor(sorted.length / 72));
    const pts = sorted.filter((_, i) => i % step === 0 || i === sorted.length - 1);

    const vals = pts.map((p) => p.resultat_obs / 1000);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const pad = Math.max(0.08, (maxVal - minVal) * 0.2);
    const yMin = minVal - pad;
    const yMax = maxVal + pad;

    const W = 600;
    const H = 170;
    const ML = 44;
    const MR = 14;
    const MT = 16;
    const MB = 26;
    const innerW = W - ML - MR;
    const innerH = H - MT - MB;

    const toX = (idx) => ML + (idx / (pts.length - 1)) * innerW;
    const toY = (v) => MT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

    const linePoints = pts.map((p, i) => `${toX(i).toFixed(1)},${toY(p.resultat_obs / 1000).toFixed(1)}`).join(' ');
    const areaPoints = `${ML},${MT + innerH} ${linePoints} ${ML + innerW},${MT + innerH}`;

    const lastPt = pts[pts.length - 1];
    const lastX = toX(pts.length - 1).toFixed(1);
    const lastY = toY(lastPt.resultat_obs / 1000).toFixed(1);

    document.getElementById('chart-72h-range').textContent =
      `Min ${minVal.toFixed(2).replace('.', ',')} m • Max ${maxVal.toFixed(2).replace('.', ',')} m`;

    container.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbe de hauteur d'eau sur 72 heures à Tours Pont Mirabeau">
        <defs>
          <linearGradient id="grad72h" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#144963" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#144963" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <line x1="${ML}" y1="${MT}" x2="${W - MR}" y2="${MT}" stroke="#e5dfd3" stroke-dasharray="3 3"/>
        <line x1="${ML}" y1="${MT + innerH / 2}" x2="${W - MR}" y2="${MT + innerH / 2}" stroke="#e5dfd3" stroke-dasharray="3 3"/>
        <line x1="${ML}" y1="${MT + innerH}" x2="${W - MR}" y2="${MT + innerH}" stroke="#d1c8b8"/>
        <text x="${ML - 6}" y="${MT + 4}" text-anchor="end" font-size="11" fill="#555e58">${yMax.toFixed(2)}</text>
        <text x="${ML - 6}" y="${MT + innerH / 2 + 4}" text-anchor="end" font-size="11" fill="#555e58">${((yMax + yMin) / 2).toFixed(2)}</text>
        <text x="${ML - 6}" y="${MT + innerH + 4}" text-anchor="end" font-size="11" fill="#555e58">${yMin.toFixed(2)}</text>
        <polygon points="${areaPoints}" fill="url(#grad72h)"/>
        <polyline points="${linePoints}" fill="none" stroke="#144963" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${lastX}" cy="${lastY}" r="4.5" fill="#8f3b26" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${ML}" y="${H - 6}" font-size="11" fill="#555e58">-72 h</text>
        <text x="${ML + innerW / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#555e58">-36 h</text>
        <text x="${W - MR}" y="${H - 6}" text-anchor="end" font-size="11" fill="#144963" font-weight="700">Maintenant (${formatHeightMeters(lastPt.resultat_obs)})</text>
      </svg>
    `;
  }

  async function loadHubEau() {
    const now = new Date();
    const iso72h = new Date(now.getTime() - 72 * 3600 * 1000).toISOString();
    const iso24h = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();

    // Tours 72h série H + dernier Q
    const [tours72Res, toursQ, ...cascadeData] = await Promise.all([
      fetch(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=K490003010&grandeur_hydro=H&date_debut_obs=${encodeURIComponent(iso72h)}&size=1000&sort=desc`)
        .then((r) => (r.ok ? r.json() : { data: [] })),
      fetchHubEauLatest('K490003010', 'Q'),
      ...CASCADE_STATIONS.map(async (st) => {
        const [hNow, hPrev, qNow] = await Promise.all([
          fetchHubEauLatest(st.code, 'H'),
          fetchHubEauLatest(st.code, 'H', `&date_fin_obs=${encodeURIComponent(iso24h)}`),
          fetchHubEauLatest(st.code, 'Q')
        ]);
        return { ...st, hNow, hPrev, qNow };
      })
    ]);

    const seriesTours = tours72Res.data || [];
    render72hChart(seriesTours);

    // Carte principale Tours
    const toursSt = cascadeData[cascadeData.length - 1];
    const toursH = toursSt?.hNow?.resultat_obs ?? (seriesTours[0]?.resultat_obs ?? null);
    const toursHPrev = toursSt?.hPrev?.resultat_obs ?? null;
    const toursQVal = toursQ?.resultat_obs ?? toursSt?.qNow?.resultat_obs ?? null;

    document.getElementById('river-tours-height').textContent = formatHeightMeters(toursH);
    document.getElementById('river-tours-flow').textContent = formatFlowM3s(toursQVal);

    if (toursH !== null && toursHPrev !== null) {
      const diffCm = Math.round((toursH - toursHPrev) / 10);
      const sign = diffCm > 0 ? '+' : '';
      const arrow = diffCm >= 3 ? '↗' : diffCm <= -3 ? '↘' : '→';
      document.getElementById('river-tours-delta').textContent = `Variation 24h : ${arrow} ${sign}${diffCm} cm`;
    } else {
      document.getElementById('river-tours-delta').textContent = 'Variation 24h : indisponible';
    }

    if (toursH !== null) {
      const hMeters = toursH / 1000;
      const nav = getRiverNavBadge(hMeters);
      const badge = document.getElementById('river-nav-badge');
      badge.textContent = nav.text;
      badge.className = `river-level-badge ${nav.cls}`;

      const marker = document.getElementById('river-scale-marker');
      if (marker) {
        const pct = Math.min(98, Math.max(2, ((hMeters - (-0.2)) / 3.4) * 100));
        marker.style.left = `${pct.toFixed(1)}%`;
      }

      const heroRiver = document.getElementById('hero-river-pill');
      if (heroRiver) {
        heroRiver.textContent = `🌊 Loire à Tours : ${formatHeightMeters(toursH)} (${nav.text})`;
      }
    }

    const obsTime = toursSt?.hNow?.date_obs ? formatHourFr(toursSt.hNow.date_obs) : '';
    document.getElementById('river-tours-meta').textContent =
      `Pont Mirabeau${obsTime ? ` (mesure de ${obsTime})` : ''}. Repères indicatifs à calibrer avec les pilotes.`;

    // Cascade amont
    const grid = document.getElementById('upstream-cascade-grid');
    grid.innerHTML = '';
    cascadeData.forEach((st) => {
      const hMm = st.hNow?.resultat_obs ?? null;
      const hPrevMm = st.hPrev?.resultat_obs ?? null;
      let trendText = '→';
      if (hMm !== null && hPrevMm !== null) {
        const dCm = Math.round((hMm - hPrevMm) / 10);
        trendText = dCm >= 3 ? `↗ +${dCm} cm` : dCm <= -3 ? `↘ ${dCm} cm` : '→ stable';
      }

      const card = document.createElement('div');
      card.className = `station-card${st.isTarget ? ' is-target' : ''}`;
      card.innerHTML = `
        <span class="station-name">${st.name}</span>
        <span class="station-delay">${st.delay}</span>
        <span class="station-height">${formatHeightMeters(hMm)}</span>
        <div class="station-meta">
          <span>${formatFlowM3s(st.qNow?.resultat_obs ?? null)}</span>
          <span>${trendText}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderGlofasChart(horizonDays) {
    const container = document.getElementById('chart-glofas-container');
    if (!glofasCache || !glofasCache.daily) {
      container.innerHTML = '<div class="skeleton-box">Tendances GloFAS indisponibles.</div>';
      return;
    }

    const d = glofasCache.daily;
    const todayIso = addDaysIso(0);
    let todayIdx = d.time.indexOf(todayIso);
    if (todayIdx === -1) todayIdx = Math.min(5, d.time.length - 1);

    const endIdx = Math.min(d.time.length, todayIdx + horizonDays + 1);
    const items = [];
    for (let i = 0; i < endIdx; i++) {
      const mean = d.river_discharge_mean[i] ?? d.river_discharge[i];
      if (mean === null || mean === undefined) continue;
      items.push({
        date: d.time[i],
        isFuture: i >= todayIdx,
        isToday: i === todayIdx,
        mean,
        min: d.river_discharge_min[i] ?? mean,
        max: d.river_discharge_max[i] ?? mean
      });
    }

    if (items.length < 3) {
      container.innerHTML = '<div class="skeleton-box">Série GloFAS insuffisante.</div>';
      return;
    }

    const allVals = items.flatMap((it) => [it.min, it.max, it.mean]);
    const yMin = Math.max(0, Math.min(...allVals) * 0.85);
    const yMax = Math.max(...allVals) * 1.1;

    const W = 600;
    const H = 186;
    const ML = 50;
    const MR = 14;
    const MT = 22;
    const MB = 28;
    const innerW = W - ML - MR;
    const innerH = H - MT - MB;

    const toX = (i) => ML + (i / (items.length - 1)) * innerW;
    const toY = (v) => MT + innerH - ((v - yMin) / Math.max(1, yMax - yMin)) * innerH;

    const upperPts = items.map((it, i) => `${toX(i).toFixed(1)},${toY(it.max).toFixed(1)}`);
    const lowerPts = [...items].reverse().map((it, i) => {
      const origIdx = items.length - 1 - i;
      return `${toX(origIdx).toFixed(1)},${toY(it.min).toFixed(1)}`;
    });
    const bandPolygon = [...upperPts, ...lowerPts].join(' ');

    const pastItems = items.filter((it) => !it.isFuture || it.isToday);
    const futureItems = items.filter((it) => it.isFuture);
    const pastStartIdx = 0;
    const futureStartIdx = Math.max(0, items.findIndex((it) => it.isFuture));

    const pastLine = pastItems
      .map((it, idx) => `${toX(pastStartIdx + idx).toFixed(1)},${toY(it.mean).toFixed(1)}`)
      .join(' ');
    const futureLine = futureItems
      .map((it, idx) => `${toX(futureStartIdx + idx).toFixed(1)},${toY(it.mean).toFixed(1)}`)
      .join(' ');

    const todayPos = items.findIndex((it) => it.isToday);
    const todayX = todayPos >= 0 ? toX(todayPos).toFixed(1) : ML;

    const curFlow = items[todayPos >= 0 ? todayPos : 0].mean;
    const endFlow = items[items.length - 1].mean;
    const ratio = (endFlow - curFlow) / Math.max(1, curFlow);
    const badge = document.getElementById('glofas-summary-badge');
    if (ratio > 0.15) {
      badge.textContent = `↗ Hausse prévue (~${Math.round(endFlow)} m³/s)`;
      badge.className = 'trend-pill badge-amber';
    } else if (ratio < -0.15) {
      badge.textContent = `↘ Baisse prévue (~${Math.round(endFlow)} m³/s)`;
      badge.className = 'trend-pill badge-blue';
    } else {
      badge.textContent = `→ Débit assez stable (~${Math.round(endFlow)} m³/s)`;
      badge.className = 'trend-pill badge-green';
    }

    document.getElementById('glofas-caption').textContent =
      `Débit passé (-5 j) et tendance prévue (+${horizonDays} j)`;

    container.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tendances de débit GloFAS sur ${horizonDays} jours à Rochecorbon">
        <line x1="${ML}" y1="${MT}" x2="${W - MR}" y2="${MT}" stroke="#e5dfd3" stroke-dasharray="3 3"/>
        <line x1="${ML}" y1="${MT + innerH / 2}" x2="${W - MR}" y2="${MT + innerH / 2}" stroke="#e5dfd3" stroke-dasharray="3 3"/>
        <line x1="${ML}" y1="${MT + innerH}" x2="${W - MR}" y2="${MT + innerH}" stroke="#d1c8b8"/>
        <text x="${ML - 6}" y="${MT + 4}" text-anchor="end" font-size="11" fill="#52606d">${Math.round(yMax)}</text>
        <text x="${ML - 6}" y="${MT + innerH / 2 + 4}" text-anchor="end" font-size="11" fill="#52606d">${Math.round((yMax + yMin) / 2)}</text>
        <text x="${ML - 6}" y="${MT + innerH + 4}" text-anchor="end" font-size="11" fill="#52606d">${Math.round(yMin)}</text>
        <text x="${ML - 6}" y="${MT - 10}" text-anchor="end" font-size="10" fill="#52606d" font-weight="600">m³/s</text>

        <polygon points="${bandPolygon}" fill="rgba(20, 73, 99, 0.16)"/>
        <line x1="${todayX}" y1="${MT}" x2="${todayX}" y2="${MT + innerH}" stroke="#8f3b26" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="${todayX}" y="${MT - 3}" text-anchor="middle" font-size="10" fill="#8f3b26" font-weight="700">Aujourd'hui</text>

        ${pastLine ? `<polyline points="${pastLine}" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linejoin="round"/>` : ''}
        ${futureLine ? `<polyline points="${futureLine}" fill="none" stroke="#144963" stroke-width="2.8" stroke-linejoin="round"/>` : ''}

        <text x="${ML}" y="${H - 6}" font-size="11" fill="#555e58">${items[0].date.slice(5)}</text>
        <text x="${W - MR}" y="${H - 6}" text-anchor="end" font-size="11" fill="#144963" font-weight="700">+${horizonDays} j (${items[items.length - 1].date.slice(5)})</text>
      </svg>
    `;
  }

  async function loadGlofas() {
    const url =
      `https://flood-api.open-meteo.com/v1/flood?latitude=${ROCHECORBON_LAT}&longitude=${ROCHECORBON_LON}` +
      `&daily=river_discharge,river_discharge_mean,river_discharge_min,river_discharge_max&past_days=5&forecast_days=30`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('GloFAS HTTP ' + res.status);
    glofasCache = await res.json();
    renderGlofasChart(glofasHorizon);
  }

  function applyWeatherFallback() {
    document.getElementById('weather-current-icon').textContent = '⛅';
    document.getElementById('weather-current-temp').textContent = '11 °C';
    document.getElementById('weather-current-desc').textContent = 'Peu nuageux (aperçu hors ligne)';
    document.getElementById('weather-current-wind').textContent = '14 km/h (raf. 24)';
    document.getElementById('weather-current-dir').textContent = '↗ SO (225°)';
    document.getElementById('weather-sun-times').textContent = '08:10 / 17:15';
    const badgeEl = document.getElementById('sail-condition-badge');
    badgeEl.textContent = 'Idéal voile carrée';
    badgeEl.className = 'sail-badge badge-green';
    const list = document.getElementById('weather-7d-list');
    if (list && list.querySelector('.skeleton-box')) {
      list.innerHTML = '<div class="info-note" style="margin:0">Prévisions 7 jours indisponibles hors connexion.</div>';
    }
  }

  function applyRiverFallback() {
    document.getElementById('river-tours-height').textContent = '1,22 m';
    document.getElementById('river-tours-flow').textContent = '216 m³/s';
    document.getElementById('river-tours-delta').textContent = 'Variation 24h : → stable';
    const badge = document.getElementById('river-nav-badge');
    badge.textContent = 'Niveau favorable';
    badge.className = 'river-level-badge badge-green';
    document.getElementById('river-tours-meta').textContent =
      'Données de démonstration (hors ligne). Repères indicatifs à calibrer avec les pilotes.';
  }

  async function refreshAllLive() {
    const statusEl = document.getElementById('live-sync-status');
    statusEl.textContent = 'Actualisation des relevés officiels…';
    const results = await Promise.allSettled([loadWeather(), loadHubEau(), loadGlofas()]);
    if (results[0].status === 'rejected') applyWeatherFallback();
    if (results[1].status === 'rejected') applyRiverFallback();
    const okCount = results.filter((r) => r.status === 'fulfilled').length;
    const nowLabel = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date());

    if (okCount === 3) {
      statusEl.textContent = `Données temps réel synchronisées à ${nowLabel} (Hub'Eau & Open-Meteo).`;
    } else if (okCount > 0) {
      statusEl.textContent = `Synchronisation partielle à ${nowLabel} (${okCount}/3 sources actives).`;
    } else {
      statusEl.textContent = 'Données de démonstration (hors ligne).';
    }
  }

  // =========================================================================
  // PLANNING, RESERVATIONS & EXPORT .ICS
  // =========================================================================

  function typeBadgeInfo(type) {
    if (type === 'dimanche') return { label: '⛵ Dimanche de la Rabouilleuse', cls: 'type-balade' };
    if (type === 'balade') return { label: '⛵ Balade', cls: 'type-balade' };
    return { label: '🎶 Bateau-Lavoir & Événement', cls: 'type-formation' };
  }

  function downloadIcs(act) {
    const [y, m, d] = act.date.split('-').map(Number);
    const [hh, mm] = act.time.split(':').map(Number);
    const start = new Date(y, m - 1, d, hh, mm);
    const end = new Date(start.getTime() + (act.durationMin || 90) * 60000);

    const fmt = (dt) =>
      dt.getFullYear() +
      String(dt.getMonth() + 1).padStart(2, '0') +
      String(dt.getDate()).padStart(2, '0') +
      'T' +
      String(dt.getHours()).padStart(2, '0') +
      String(dt.getMinutes()).padStart(2, '0') +
      '00';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//La Rabouilleuse//Compagnon de Loire//FR',
      'BEGIN:VEVENT',
      `UID:${act.id}@larabouilleuse-demo`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${act.title} — La Rabouilleuse`,
      `LOCATION:${act.place}`,
      `DESCRIPTION:${act.description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rabouilleuse-${act.date}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('📅 Événement téléchargé (.ics) pour votre agenda');
  }

  function renderMyBookings() {
    const panel = document.getElementById('my-bookings-panel');
    const list = document.getElementById('my-bookings-list');
    if (!state.bookings.length) {
      panel.hidden = true;
      list.innerHTML = '';
      return;
    }

    panel.hidden = false;
    list.innerHTML = '';
    state.bookings.forEach((bk) => {
      const li = document.createElement('li');
      li.className = 'my-booking-item';
      const detail =
        bk.kind === 'participation'
          ? 'Participation bénévole / adhérent'
          : `${bk.adults + bk.children} place(s) • ${bk.totalEuro} €${bk.isMember ? ' (tarif adhérent)' : ''}`;
      li.innerHTML = `
        <div>
          <strong>${bk.title}</strong>
          <div class="muted-text" style="margin:0">${bk.dateLabel} à ${bk.time} • ${detail}</div>
        </div>
        <button type="button" class="btn-ghost btn-sm btn-danger-outline" data-cancel-booking="${bk.id}">Annuler</button>
      `;
      list.appendChild(li);
    });
  }

  function renderActivities() {
    renderMyBookings();
    const container = document.getElementById('activities-list');
    container.innerHTML = '';

    const filtered = state.activities
      .filter((a) => planningFilter === 'all' || a.type === planningFilter)
      .sort((a, b) => a.date.localeCompare(b.date));

    filtered.forEach((act) => {
      const remaining = Math.max(0, (act.capacity || 24) - (act.booked || 0));
      const badge = typeBadgeInfo(act.type);
      const alreadyJoined = state.bookings.some((b) => b.activityId === act.id);

      let spotsLabel = '';
      if (act.openAccess) {
        spotsLabel = 'Ouvert à tous';
      } else if (act.booked === 0) {
        spotsLabel = `${act.capacity} places (2 bateaux à couple)`;
      } else {
        spotsLabel = remaining === 0 ? 'Complet' : `${remaining} / ${act.capacity} places dispo`;
      }

      let priceLine = '';
      if (act.priceAdult > 0) {
        priceLine =
          state.role === 'member'
            ? `Tarif adhérent·e : ${act.priceMember} € (public ${act.priceAdult} €) • Enfant (-12 ans) ${act.priceChild} €`
            : `Adulte ${act.priceAdult} € • Adhérent·e ${act.priceMember} € • Enfant (-12 ans) ${act.priceChild} €`;
      } else {
        priceLine = act.priceLabel || 'Accès libre';
      }

      let primaryBtnHtml = '';
      if (act.openAccess) {
        if (alreadyJoined) {
          primaryBtnHtml = `<button type="button" class="btn-secondary btn-sm" disabled>✅ Je viens</button>`;
        } else {
          primaryBtnHtml = `<button type="button" class="btn-primary btn-sm" data-join-activity="${act.id}">Je viens / M’inscrire</button>`;
        }
      } else {
        primaryBtnHtml = `<button type="button" class="btn-primary btn-sm" data-book-activity="${act.id}" ${remaining === 0 ? 'disabled' : ''}>Réserver</button>`;
      }

      const timeRange = act.endTime ? `${act.time}–${act.endTime}` : act.time;
      const extLinkHtml = act.externalUrl
        ? `<a class="btn-ghost btn-sm" href="${act.externalUrl}" target="_blank" rel="noopener noreferrer">Programme ↗</a>`
        : '';

      const card = document.createElement('article');
      card.className = 'activity-card';
      card.innerHTML = `
        <div>
          <div class="activity-top">
            <span class="activity-badge ${badge.cls}">${badge.label}</span>
            <span class="activity-spots${!act.openAccess && remaining === 0 ? ' is-full' : ''}">
              ${spotsLabel}
            </span>
          </div>
          <h3 class="activity-title">${act.title}</h3>
          <div class="activity-meta">
            <span>📅 ${formatDateFr(act.date)} • ${timeRange}</span>
            <span>📍 ${act.place}</span>
          </div>
          <p class="muted-text" style="margin-top:0.45rem;margin-bottom:0">${act.description}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.55rem">
          <div class="activity-price">${priceLine}</div>
          <div class="activity-actions">
            ${primaryBtnHtml}
            ${extLinkHtml}
            <button type="button" class="btn-secondary btn-sm" data-ics-activity="${act.id}" title="Ajouter à votre agenda">📅 .ics</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function updateBookingPricePreview() {
    const actId = document.getElementById('booking-activity-id').value;
    const act = state.activities.find((a) => a.id === actId) || CUSTOM_FORMULAS[actId] || null;
    const adults = Math.max(0, Number(document.getElementById('booking-adults').value || 0));
    const children = Math.max(0, Number(document.getElementById('booking-children').value || 0));
    const isMember = document.getElementById('booking-is-member').checked;
    const preview = document.getElementById('booking-price-preview');

    if (!act) {
      preview.innerHTML = 'Journée (2h min) : <strong>240 €</strong> (200 € adhérent·e, 120 €/h supp) • Soirée (2h30 min) : <strong>390 €</strong> (350 € adhérent·e).';
      return;
    }

    const adultUnit = isMember ? act.priceMember : act.priceAdult;
    const total = adults * adultUnit + children * act.priceChild;
    preview.innerHTML = `Total estimé (${adults + children} pers.) : <strong>${total} €</strong> ${isMember ? '<em>(tarif adhérent appliqué)</em>' : ''}`;
  }

  function openBookingModal(activityId) {
    const act = state.activities.find((a) => a.id === activityId);
    const formula = CUSTOM_FORMULAS[activityId] || null;
    const form = document.getElementById('booking-form');
    form.reset();

    document.getElementById('booking-activity-id').value = act ? act.id : (formula ? formula.id : 'private-quote');
    document.getElementById('booking-is-member').checked = state.role === 'member';

    const titleEl = document.getElementById('booking-dialog-title');
    const summaryEl = document.getElementById('booking-activity-summary');

    if (act) {
      titleEl.textContent = 'Réserver une sortie';
      const timeRange = act.endTime ? `${act.time}–${act.endTime}` : act.time;
      summaryEl.innerHTML = `<strong>${act.title}</strong><br>${formatDateFr(act.date)} • ${timeRange}<br>${act.place}`;
      document.getElementById('booking-adults').value = '2';
      document.getElementById('booking-children').value = '0';
    } else if (formula) {
      titleEl.textContent = `Réserver : ${formula.title}`;
      summaryEl.innerHTML = `<strong>${formula.title}</strong><br>${formula.subtitle}`;
      document.getElementById('booking-adults').value = String(formula.defaultAdults);
      document.getElementById('booking-children').value = '0';
    } else {
      titleEl.textContent = 'Demander une privatisation';
      summaryEl.innerHTML = '<strong>Mise à disposition d’un bateau avec pilote (12 pers. max)</strong><br>1 humain = passager dès 1 an • Journée 240 € (200 € adhérent·e) • Soirée 390 € (350 € adhérent·e).';
      document.getElementById('booking-adults').value = '6';
      document.getElementById('booking-children').value = '0';
    }

    updateBookingPricePreview();
    openModal('booking-dialog');
  }

  // =========================================================================
  // ALBUM PHOTO LOIRE
  // =========================================================================

  function renderAlbum() {
    const grid = document.getElementById('album-grid');
    grid.innerHTML = '';

    const photos = state.photos.filter((p) => albumFilter === 'all' || p.category === albumFilter);
    photos.forEach((ph) => {
      const card = document.createElement('article');
      card.className = 'photo-card';
      card.innerHTML = `
        <button type="button" class="photo-trigger" data-open-photo="${ph.id}" aria-label="Agrandir : ${ph.title}">
          <img src="${ph.src}" alt="${ph.title}" loading="lazy">
        </button>
        <div class="photo-meta">
          <div class="photo-title">${ph.title}</div>
          <div class="photo-foot">
            <span>${ph.author}</span>
            <button type="button" class="like-btn${ph.liked ? ' liked' : ''}" data-like-photo="${ph.id}" aria-pressed="${ph.liked}">
              ${ph.liked ? '❤️' : '🤍'} ${ph.likes}
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function openLightbox(photoId) {
    const ph = state.photos.find((p) => p.id === photoId);
    if (!ph) return;
    currentLightboxPhotoId = photoId;
    document.getElementById('lightbox-title').textContent = ph.title;
    const img = document.getElementById('lightbox-img');
    img.src = ph.src;
    img.alt = ph.title;
    document.getElementById('lightbox-caption').textContent = `Par ${ph.author} • ${ph.dateLabel}`;
    document.getElementById('lightbox-like-count').textContent = String(ph.likes);
    openModal('lightbox-dialog');
  }

  function togglePhotoLike(photoId) {
    const ph = state.photos.find((p) => p.id === photoId);
    if (!ph) return;
    ph.liked = !ph.liked;
    ph.likes += ph.liked ? 1 : -1;
    saveState();
    renderAlbum();
    if (currentLightboxPhotoId === photoId) {
      document.getElementById('lightbox-like-count').textContent = String(ph.likes);
    }
  }

  function compressImageFile(file, maxWidth = 1000, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Lecture fichier impossible'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Format image non reconnu'));
        img.onload = () => {
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // EVENEMENTS UI & INITIALISATION
  // =========================================================================

  function bindEvents() {
    // Onglets bas
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Rôle Visiteur / Adhérent
    document.querySelectorAll('.role-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.role = btn.dataset.role === 'member' ? 'member' : 'visitor';
        saveState();
        applyRoleUI();
        showToast(state.role === 'member' ? '⚓ Mode Adhérent / CA activé' : '👤 Mode Visiteur activé');
      });
    });

    // Info démo & Reset
    document.getElementById('open-demo-info-btn').addEventListener('click', () => openModal('demo-info-dialog'));
    document.getElementById('reset-demo-btn').addEventListener('click', () => {
      state = createDefaultState();
      saveState();
      renderFlash();
      applyRoleUI();
      renderAlbum();
      closeModal('demo-info-dialog');
      showToast('↺ Données de démonstration réinitialisées');
    });

    // Rafraîchissement live & horizon GloFAS
    document.getElementById('refresh-loire-btn').addEventListener('click', refreshAllLive);
    document.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        glofasHorizon = Number(btn.dataset.horizon);
        document.querySelectorAll('.seg-btn').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderGlofasChart(glofasHorizon);
      });
    });

    // Édition info flash
    document.getElementById('edit-flash-btn').addEventListener('click', () => {
      document.getElementById('flash-form').reset();
      document.getElementById('flash-input').value = state.flash.text;
      openModal('flash-dialog');
    });

    document.getElementById('flash-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!e.target.reportValidity()) return;
      state.flash = {
        text: document.getElementById('flash-input').value.trim(),
        updatedAt: `Modifié à ${formatHourFr(new Date().toISOString())} • Mode Adhérent`
      };
      saveState();
      renderFlash();
      closeModal('flash-dialog');
      showToast('📢 Info embarquement mise à jour');
    });

    // Filtres Planning
    document.querySelectorAll('[data-plan-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        planningFilter = btn.dataset.planFilter;
        document.querySelectorAll('[data-plan-filter]').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderActivities();
      });
    });

    // Actions Planning (délégation)
    document.getElementById('activities-list').addEventListener('click', (e) => {
      const bookBtn = e.target.closest('[data-book-activity]');
      if (bookBtn) {
        openBookingModal(bookBtn.dataset.bookActivity);
        return;
      }

      const joinBtn = e.target.closest('[data-join-activity]');
      if (joinBtn) {
        const act = state.activities.find((a) => a.id === joinBtn.dataset.joinActivity);
        if (!act) return;
        if (!act.openAccess && state.role !== 'member') {
          showToast('Activez le mode ⚓ Adhérent en haut pour vous inscrire');
          return;
        }
        act.booked = (act.booked || 0) + 1;
        state.bookings.push({
          id: 'bk-' + Date.now(),
          activityId: act.id,
          title: act.title,
          dateLabel: formatDateFr(act.date),
          time: act.time,
          adults: 1,
          children: 0,
          isMember: state.role === 'member',
          totalEuro: 0,
          kind: 'participation'
        });
        saveState();
        renderActivities();
        showToast(`✅ Noté dans votre agenda : ${act.title}`);
        return;
      }

      const icsBtn = e.target.closest('[data-ics-activity]');
      if (icsBtn) {
        const act = state.activities.find((a) => a.id === icsBtn.dataset.icsActivity);
        if (act) downloadIcs(act);
      }
    });

    // Annulation réservation
    document.getElementById('my-bookings-list').addEventListener('click', (e) => {
      const cancelBtn = e.target.closest('[data-cancel-booking]');
      if (!cancelBtn) return;
      const bkId = cancelBtn.dataset.cancelBooking;
      const idx = state.bookings.findIndex((b) => b.id === bkId);
      if (idx === -1) return;
      const bk = state.bookings[idx];
      const act = state.activities.find((a) => a.id === bk.activityId);
      if (act) {
        act.booked = Math.max(0, act.booked - (bk.adults + bk.children));
      }
      state.bookings.splice(idx, 1);
      saveState();
      renderActivities();
      showToast('Réservation annulée');
    });

    // Formules à la carte & Privatisation
    document.getElementById('open-decouverte-btn').addEventListener('click', () => openBookingModal('custom-decouverte'));
    document.getElementById('open-crepuscule-btn').addEventListener('click', () => openBookingModal('custom-crepuscule'));
    document.getElementById('open-private-quote-btn').addEventListener('click', () => openBookingModal('private-quote'));

    // Formulaire réservation
    ['booking-adults', 'booking-children', 'booking-is-member'].forEach((id) => {
      document.getElementById(id).addEventListener('input', updateBookingPricePreview);
      document.getElementById(id).addEventListener('change', updateBookingPricePreview);
    });

    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!e.target.reportValidity()) return;

      const adults = Number(document.getElementById('booking-adults').value || 0);
      const children = Number(document.getElementById('booking-children').value || 0);
      if (adults + children < 1) {
        showToast('⚠️ Indiquez au moins 1 passager');
        document.getElementById('booking-adults').focus();
        return;
      }

      const actId = document.getElementById('booking-activity-id').value;
      const act = state.activities.find((a) => a.id === actId);
      const formula = CUSTOM_FORMULAS[actId] || null;
      const isMember = document.getElementById('booking-is-member').checked;

      if (act) {
        const remaining = act.capacity - act.booked;
        if (adults + children > remaining) {
          showToast(`⚠️ Il reste seulement ${remaining} place(s) disponible(s)`);
          return;
        }
        act.booked += adults + children;
        const totalEuro = adults * (isMember ? act.priceMember : act.priceAdult) + children * act.priceChild;
        state.bookings.push({
          id: 'bk-' + Date.now(),
          activityId: act.id,
          title: act.title,
          dateLabel: formatDateFr(act.date),
          time: act.time,
          adults,
          children,
          isMember,
          totalEuro,
          kind: 'reservation'
        });
        showToast(`🎟️ Pré-réservation enregistrée (${totalEuro} €)`);
      } else if (formula) {
        const totalEuro = adults * (isMember ? formula.priceMember : formula.priceAdult) + children * formula.priceChild;
        state.bookings.push({
          id: 'bk-' + Date.now(),
          activityId: formula.id,
          title: formula.title,
          dateLabel: 'Date à convenir (à la carte)',
          time: 'Selon horaire',
          adults,
          children,
          isMember,
          totalEuro,
          kind: 'reservation'
        });
        showToast(`🎟️ Demande enregistrée : ${formula.title} (${totalEuro} €)`);
      } else {
        state.bookings.push({
          id: 'bk-' + Date.now(),
          activityId: 'private-quote',
          title: 'Demande de privatisation bateau',
          dateLabel: 'Date à convenir',
          time: 'Sur mesure',
          adults,
          children,
          isMember,
          totalEuro: isMember ? 200 : 240,
          kind: 'reservation'
        });
        showToast('📩 Demande de privatisation enregistrée (démo)');
      }

      saveState();
      renderActivities();
      closeModal('booking-dialog');
    });

    // Ajout activité (Mode Adhérent / CA)
    document.getElementById('open-add-activity-btn').addEventListener('click', () => {
      const form = document.getElementById('activity-form');
      form.reset();
      document.getElementById('act-date').value = addDaysIso(4);
      document.getElementById('act-time').value = '14:00';
      document.getElementById('act-spots').value = '12';
      document.getElementById('act-place').value = 'Ponton du Bateau-Lavoir (Rochecorbon)';
      openModal('activity-dialog');
    });

    document.getElementById('activity-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!e.target.reportValidity()) return;

      const type = document.getElementById('act-type').value;
      const isPaid = type === 'dimanche' || type === 'balade';
      state.activities.push({
        id: 'act-' + Date.now(),
        type,
        title: document.getElementById('act-title').value.trim(),
        date: document.getElementById('act-date').value,
        time: document.getElementById('act-time').value,
        durationMin: type === 'dimanche' ? 150 : 90,
        place: document.getElementById('act-place').value.trim(),
        capacity: Number(document.getElementById('act-spots').value || 12),
        booked: 0,
        priceAdult: type === 'dimanche' ? 36 : (type === 'balade' ? 20 : 0),
        priceMember: type === 'dimanche' ? 25 : (type === 'balade' ? 15 : 0),
        priceChild: type === 'dimanche' ? 16 : (type === 'balade' ? 12 : 0),
        openAccess: !isPaid,
        priceLabel: !isPaid ? 'Accès libre' : undefined,
        description: 'Événement ajouté au calendrier.'
      });

      saveState();
      renderActivities();
      closeModal('activity-dialog');
      showToast('⛵ Activité ajoutée au planning');
    });

    // Filtres Album & Lightbox
    document.querySelectorAll('[data-album-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        albumFilter = btn.dataset.albumFilter;
        document.querySelectorAll('[data-album-filter]').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderAlbum();
      });
    });

    document.getElementById('album-grid').addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-photo]');
      if (openBtn) {
        openLightbox(openBtn.dataset.openPhoto);
        return;
      }
      const likeBtn = e.target.closest('[data-like-photo]');
      if (likeBtn) {
        togglePhotoLike(likeBtn.dataset.likePhoto);
      }
    });

    document.getElementById('lightbox-like-btn').addEventListener('click', () => {
      if (currentLightboxPhotoId) togglePhotoLike(currentLightboxPhotoId);
    });

    document.getElementById('open-add-photo-btn').addEventListener('click', () => {
      if (state.role !== 'member') {
        showToast('Activez le mode ⚓ Adhérent en haut pour tester le dépôt photo');
        return;
      }
      document.getElementById('photo-form').reset();
      openModal('photo-dialog');
    });

    document.getElementById('photo-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!e.target.reportValidity()) return;

      const fileInput = document.getElementById('photo-file');
      const file = fileInput.files?.[0];
      if (!file) return;

      try {
        const compressed = await compressImageFile(file);
        state.photos.unshift({
          id: 'ph-' + Date.now(),
          src: compressed,
          title: document.getElementById('photo-title').value.trim(),
          category: document.getElementById('photo-category').value,
          author: document.getElementById('photo-author').value.trim(),
          dateLabel: "Aujourd'hui",
          likes: 1,
          liked: true
        });
        saveState();
        renderAlbum();
        closeModal('photo-dialog');
        showToast('📸 Photo compressée et ajoutée à l’album');
      } catch {
        showToast('⚠️ Impossible de traiter cette image');
      }
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDialogs();
    initAccessibleValidation();
    bindEvents();
    renderFlash();
    applyRoleUI();
    renderAlbum();
    refreshAllLive();
    registerServiceWorker();
  });
})();
