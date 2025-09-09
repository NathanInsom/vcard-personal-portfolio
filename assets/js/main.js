// Theme
(function manageTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  // Default to dark if no stored preference
  if (!stored) {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else if (stored === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', '');
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? '' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }
})();

// Mobile nav
(function mobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

// Reveal on scroll
(function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();

// Subtle parallax in hero
(function heroParallax() {
  const hero = document.querySelector('.hero-art');
  if (!hero) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const circle = hero.querySelector('.circle');
  const blob = hero.querySelector('.blob');
  const mesh = hero.querySelector('.mesh');
  function move(e) {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    circle.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    blob.style.transform = `translate(${x * -12}px, ${y * -10}px)`;
    mesh.style.transform = `translate(${x * 10}px, ${y * -8}px)`;
  }
  hero.addEventListener('mousemove', move);
})();

// Year in footer
document.getElementById('year').textContent = String(new Date().getFullYear());

// Projects data + modal logic
(function projectsModule() {
  const projects = [
    {
      id: 'ad-gpo',
      title: 'Infra AD DS + GPO baselines',
      context: 'Cours | 2024',
      contexte: 'Mise en place d’un domaine Active Directory de lab avec OU, comptes et GPO baseline CIS.',
      objectif: 'Centraliser l’authentification et appliquer des politiques de sécurité standardisées.',
      architecture: [
        'Client Windows 11',
        'Serveur AD DS (DC01)',
        'DNS intégré AD',
        'Réseau LAN 192.168.10.0/24'
      ],
      actions: [
        'Promotion AD DS, création OU + comptes',
        'GPO baselines (verrouillage, pare-feu, MDP)',
        'Déploiement scripts de connexion',
        'Sauvegarde état du système (wbadmin)'
      ],
      securite: [
        'Durcissement GPO (CIS baseline)',
        'Journalisation avancée (Events/WinRM)',
        'Contrôle des accès (ACL sur partages)'
      ],
      resultats: [
        'Réduction incidents login (-40%)',
        'Temps de déploiement poste ↓ (≈15 min)',
        'Standardisation des configurations'
      ],
      evidence: [
        'Captures GPMC + OU',
        'Extrait script .ps1 de logon',
        'Export des GPO (.html)'
      ],
      tags: ['E6', 'SISR', 'AD', 'GPO'],
      doc: '#'
    },
    {
      id: 'vlan-firewall',
      title: 'Segmentation VLAN + Pare-feu',
      context: 'Perso | 2024',
      contexte: 'Homelab avec switch manageable et firewall open-source pour séparer IoT/Invités/Prod.',
      objectif: 'Isoler les réseaux et contrôler les flux Est-Ouest et Nord-Sud.',
      architecture: [
        'Switch L2/L3 (VLAN 10/20/30)',
        'Firewall (pfSense/OPNsense)',
        'AP Wi-Fi (SSID multiples)'
      ],
      actions: [
        'Création VLAN + Trunks + DHCP par VLAN',
        'Règles firewall par zone',
        'NAT + DNS forwarder',
        'Monitoring (Netflow/Logs)'
      ],
      securite: [
        'Blocage inter-VLAN par défaut',
        'MFA pour l’admin FW',
        'Logs + alertes sur tentatives'
      ],
      resultats: [
        'Surface d’attaque réduite',
        'Trafic parasite ↓',
        'Visibilité augmentée'
      ],
      evidence: [
        'Captures règles FW',
        'Export config',
        'Schéma réseau'
      ],
      tags: ['E6', 'Réseau', 'Firewall'],
      doc: '#'
    },
    {
      id: 'pw-rotation',
      title: 'Rotation mots de passe (PowerShell)',
      context: 'Pro | 2025',
      contexte: 'Automatisation de la rotation des comptes de service et d’admin local.',
      objectif: 'Renforcer la sécurité par rotation régulière et traçabilité.',
      architecture: [
        'Runner Windows',
        'Module AD PowerShell',
        'Coffre-fort (ex: KeePass/AD)'
      ],
      actions: [
        'Script PS: génération + validation complexité',
        'Rotation comptes locaux + services',
        'Journalisation + export CSV'
      ],
      securite: [
        'MDP stockés chiffrés',
        'Journalisation SIEM',
        'Revue périodique'
      ],
      resultats: [
        'Conformité politique MDP',
        'Risque compromission ↓',
        'Traçabilité complète'
      ],
      evidence: [
        'Extraits de script .ps1',
        'Logs rotation',
        'Guide d’exploitation'
      ],
      tags: ['E6', 'Automatisation', 'PowerShell'],
      doc: '#'
    },
    {
      id: 'backup-restore',
      title: 'Sauvegardes + Restauration testée',
      context: 'Cours | 2025',
      contexte: 'Mise en place d’une politique de sauvegarde 3-2-1 et tests PRA.',
      objectif: 'Garantir la reprise après incident documentée et testée.',
      architecture: [
        'Serveur backup (ex: Veeam/Borg)',
        'Stockage local + offsite',
        'Planificateur des jobs'
      ],
      actions: [
        'Jobs full + incrémental',
        'Chiffrement + rotation',
        'Test de restauration périodique'
      ],
      securite: [
        'Comptes à privilèges séparés',
        'Stockage immuable',
        'Alertes sur échecs'
      ],
      resultats: [
        'RPO/RTO respectés',
        'Indisponibilités ↓',
        'Confiance audits ↑'
      ],
      evidence: [
        'Captures jobs',
        'Rapports',
        'Procédure PRA'
      ],
      tags: ['E6', 'PRA', 'Backup'],
      doc: '#'
    }
  ];

  const modal = document.getElementById('projectModal');
  if (!modal) return;
  let lastFocused = null;
  const refs = {
    title: document.getElementById('modalTitle'),
    context: document.getElementById('modalContext'),
    contexte: document.getElementById('modalContexte'),
    objectif: document.getElementById('modalObjectif'),
    arch: document.getElementById('modalArch'),
    actions: document.getElementById('modalActions'),
    secu: document.getElementById('modalSecu'),
    results: document.getElementById('modalResults'),
    evidence: document.getElementById('modalEvidence'),
    tags: document.getElementById('modalTags'),
    doc: document.getElementById('modalDocLink')
  };

  function openModal(id) {
    const data = projects.find(p => p.id === id);
    if (!data) return;
    lastFocused = document.activeElement;
    refs.title.textContent = data.title;
    refs.context.textContent = data.context;
    refs.contexte.textContent = data.contexte;
    refs.objectif.textContent = data.objectif;
    refs.arch.innerHTML = `<div>${data.architecture.join(' • ')}</div>`;
    setList(refs.actions, data.actions);
    setList(refs.secu, data.securite);
    setList(refs.results, data.resultats);
    setList(refs.evidence, data.evidence);
    setTags(refs.tags, data.tags);
    refs.doc.href = data.doc || '#';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(modal);
  }

  function setList(ul, items) {
    ul.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  }
  function setTags(container, tags) {
    container.innerHTML = '';
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      container.appendChild(span);
    });
  }

  // Kept for backward compatibility if buttons with .open-project remain
  document.querySelectorAll('.open-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-project-id');
      openModal(id);
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocus();
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Focus trap
  let focusCleanup = null;
  function trapFocus(container) {
    const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(container.querySelectorAll(focusableSelectors)).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', handleTab);
    first.focus();
    focusCleanup = () => document.removeEventListener('keydown', handleTab);
  }
  function releaseFocus() { if (focusCleanup) { focusCleanup(); focusCleanup = null; } }
})();

// Print footer info on project pages
(function printFooterInfo() {
  const dateEl = document.getElementById('printDate');
  const urlEl = document.getElementById('printUrl');
  if (!dateEl || !urlEl) return;
  function updatePrintMeta() {
    const now = new Date();
    dateEl.textContent = `Imprimé le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    urlEl.textContent = window.location.href;
  }
  updatePrintMeta();
  window.addEventListener('beforeprint', updatePrintMeta);
})();

// Toggle synthesis embed height
(function toggleSynthesis() {
  const container = document.getElementById('synthesisEmbed');
  const btn = document.getElementById('toggleSynthesis');
  if (!container || !btn) return;
  btn.addEventListener('click', () => {
    const expanded = container.classList.toggle('expanded');
    btn.textContent = expanded ? 'Réduire' : 'Agrandir';
  });
})();


