/**
 * MeetRoom — Application JavaScript
 * Vanilla ES6+, no dependencies.
 */

/* ============================================================
   1. Constants & Config
   ============================================================ */
var API_BASE = 'http://localhost:8080';

/* ============================================================
   2. Utility helpers
   ============================================================ */

/**
 * Escape HTML to prevent XSS when injecting user-provided content.
 */
function escapeHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str == null ? '' : String(str)));
  return d.innerHTML;
}

/**
 * Format an ISO or readable date string for display.
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Date not specified';
  try {
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return escapeHtml(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return escapeHtml(dateStr);
  }
}

/**
 * Render and auto-dismiss an alert banner.
 */
function showAlert(type, message, autoDismissMs) {
  var container = document.getElementById('alertContainer');
  if (!container) return;

  var iconSuccess = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  var iconError = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  var icon = type === 'success' ? iconSuccess : iconError;
  var alertClass = type === 'success' ? 'alert--success' : 'alert--error';
  var id = 'alert-' + Date.now();

  var closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var html = '<div id="' + id + '" class="alert ' + alertClass + '" role="alert">' +
    icon +
    '<span class="alert__text">' + escapeHtml(message) + '</span>' +
    '<button class="alert__close" aria-label="Close notification" onclick="dismissAlert(\'' + id + '\')">' + closeIcon + '</button>' +
    '</div>';

  container.insertAdjacentHTML('beforeend', html);

  if (autoDismissMs) {
    setTimeout(function () { dismissAlert(id); }, autoDismissMs);
  }
}

function dismissAlert(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(-8px)';
  el.style.transition = 'opacity 200ms ease, transform 200ms ease';
  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 200);
}

/* ============================================================
   3. Navigation (shared — runs on all pages)
   ============================================================ */
(function initNav() {
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('navMobile');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', function () {
    var isOpen = toggle.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('is-open') &&
        !toggle.contains(e.target) &&
        !mobileMenu.contains(e.target)) {
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      toggle.focus();
    }
  });
})();

/* ============================================================
   4. Rooms Page
   ============================================================ */
(function initRoomsPage() {
  var grid = document.getElementById('roomsGrid');
  if (!grid) return; // not on rooms page

  var allRooms = [];
  var selectedDate = '';

  var searchTypeEl = document.getElementById('searchType');
  var searchInputEl = document.getElementById('searchInput');
  var clearBtn = document.getElementById('searchClear');
  var resultsNum = document.getElementById('resultsNum');
  var emptyState = document.getElementById('emptyState');
  var errorState = document.getElementById('errorState');

  /* ---- Load rooms from API ---- */
  window.loadRooms = function () {
    hideSkeleton();
    showSkeletons();
    hideState(emptyState);
    hideState(errorState);

    fetch(API_BASE + '/rooms')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        allRooms = Array.isArray(data) ? data : [];
        hideSkeleton();
        renderRooms(allRooms);
      })
      .catch(function () {
        hideSkeleton();
        showState(errorState);
      });
  };

  /* ---- Render room cards ---- */
  function renderRooms(rooms) {
    // Remove old rendered cards (not skeletons)
    var existing = grid.querySelectorAll('.room-card[data-rendered]');
    existing.forEach(function (el) { el.remove(); });

    if (rooms.length === 0) {
      showState(emptyState);
      updateResultsCount(0);
      return;
    }

    hideState(emptyState);
    updateResultsCount(rooms.length);

    var fragment = document.createDocumentFragment();
    rooms.forEach(function (room) {
      fragment.appendChild(buildRoomCard(room));
    });
    grid.appendChild(fragment);
  }

  /* ---- Build a single room card element ---- */
  function buildRoomCard(room) {
    var equipments = Array.isArray(room.equipements) ? room.equipements : [];
    var name = room.name || 'Untitled Room';
    var description = room.description || 'No description available.';
    var capacity = room.capacity || 0;
    var roomId = room.id || room._id || '';

    var tagsHtml = equipments.length > 0
      ? equipments.map(function (e) {
          return '<span class="tag">' + escapeHtml(e.name || e) + '</span>';
        }).join('')
      : '<span class="tag">Basic setup</span>';

    var card = document.createElement('article');
    card.className = 'room-card';
    card.setAttribute('data-rendered', '1');
    card.setAttribute('data-id', escapeHtml(String(roomId)));
    card.setAttribute('data-name', name.toLowerCase());
    card.setAttribute('data-capacity', String(capacity));
    card.setAttribute('data-equipment', equipments.map(function (e) {
      return (e.name || e).toLowerCase();
    }).join(' '));

    card.innerHTML =
      '<div class="room-card__image">' +
        '<div class="room-card__image-pattern"></div>' +
        '<div class="room-card__image-inner">' +
          '<svg class="room-card__image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' +
          '</svg>' +
        '</div>' +
        '<div class="room-card__capacity-badge">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
          escapeHtml(String(capacity)) + ' people' +
        '</div>' +
      '</div>' +
      '<div class="room-card__body">' +
        '<div class="room-card__header">' +
          '<h2 class="room-card__name">' + escapeHtml(name) + '</h2>' +
          '<span class="room-card__status room-card__status--available" aria-label="Room is available">' +
            '<span class="room-card__status--dot" aria-hidden="true"></span>' +
            'Available' +
          '</span>' +
        '</div>' +
        '<p class="room-card__desc">' + escapeHtml(description) + '</p>' +
        '<div class="room-card__tags" aria-label="Equipment">' + tagsHtml + '</div>' +
        '<div class="room-card__footer">' +
          '<div class="room-card__date-group">' +
            '<label class="room-card__date-label" for="date-' + escapeHtml(String(roomId)) + '">Select date</label>' +
            '<input type="date" class="room-card__date-input room-date-picker" id="date-' + escapeHtml(String(roomId)) + '" aria-label="Reservation date for ' + escapeHtml(name) + '" min="' + todayISO() + '">' +
          '</div>' +
          '<button type="button" class="btn btn--primary btn--sm reserve-btn" data-room-id="' + escapeHtml(String(roomId)) + '" data-room-name="' + escapeHtml(name) + '" aria-label="Reserve ' + escapeHtml(name) + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
            'Reserve' +
          '</button>' +
        '</div>' +
      '</div>';

    return card;
  }

  /* ---- Reserve room handler (delegated) ---- */
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.reserve-btn');
    if (!btn) return;

    var roomId = btn.getAttribute('data-room-id');
    var roomName = btn.getAttribute('data-room-name');
    var card = btn.closest('.room-card');
    var dateInput = card ? card.querySelector('.room-date-picker') : null;
    var date = dateInput ? dateInput.value : '';

    if (!date) {
      showAlert('error', 'Please select a date for "' + roomName + '" before reserving.');
      if (dateInput) {
        dateInput.focus();
        dateInput.style.borderColor = 'var(--color-error)';
        dateInput.addEventListener('change', function () {
          dateInput.style.borderColor = '';
        }, { once: true });
      }
      return;
    }

    reserveRoom(roomId, roomName, date, btn);
  });

  /* ---- API: Reserve a room ---- */
  function reserveRoom(roomId, roomName, date, btn) {
    var originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14" style="animation:spin 0.8s linear infinite;"><path d="M21 12a9 9 0 1 1-9-9"/></svg>' +
      'Reserving...';

    // Inject spin keyframe if not already present
    if (!document.getElementById('spin-style')) {
      var s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }

    fetch(API_BASE + '/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId, date: date })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function () {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        showAlert('success', '"' + roomName + '" reserved for ' + formatDate(date) + '.', 6000);

        // Reset date input
        var card = btn.closest('.room-card');
        if (card) {
          var di = card.querySelector('.room-date-picker');
          if (di) di.value = '';
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        showAlert('error', 'Could not reserve "' + roomName + '". Please check the server and try again.');
      });
  }

  /* ---- Search / Filter ---- */
  function filterRooms() {
    var type = searchTypeEl ? searchTypeEl.value : '';
    var query = searchInputEl ? searchInputEl.value.trim().toLowerCase() : '';

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.style.display = query ? 'inline-flex' : 'none';
    }

    if (!query) {
      renderRooms(allRooms);
      return;
    }

    var filtered = allRooms.filter(function (room) {
      switch (type) {
        case 'name':
          return (room.name || '').toLowerCase().includes(query);
        case 'capacity':
          return String(room.capacity || '').includes(query);
        case 'equipment':
          var eqs = (Array.isArray(room.equipements) ? room.equipements : []).map(function (e) {
            return (e.name || e).toLowerCase();
          });
          return eqs.some(function (eq) { return eq.includes(query); });
        default:
          return (
            (room.name || '').toLowerCase().includes(query) ||
            String(room.capacity || '').includes(query) ||
            (Array.isArray(room.equipements) ? room.equipements : []).some(function (e) {
              return (e.name || e).toLowerCase().includes(query);
            })
          );
      }
    });

    renderRooms(filtered);
  }

  if (searchInputEl) {
    searchInputEl.addEventListener('input', filterRooms);
  }
  if (searchTypeEl) {
    searchTypeEl.addEventListener('change', filterRooms);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (searchInputEl) searchInputEl.value = '';
      clearBtn.style.display = 'none';
      renderRooms(allRooms);
    });
  }

  window.clearSearch = function () {
    if (searchInputEl) searchInputEl.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    renderRooms(allRooms);
  };

  /* ---- Helpers ---- */
  function showSkeletons() {
    ['skeleton-1','skeleton-2','skeleton-3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }

  function hideSkeleton() {
    ['skeleton-1','skeleton-2','skeleton-3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function showState(el) {
    if (el) el.style.display = 'flex';
  }

  function hideState(el) {
    if (el) el.style.display = 'none';
  }

  function updateResultsCount(n) {
    if (resultsNum) resultsNum.textContent = String(n);
  }

  function todayISO() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  /* ---- Boot ---- */
  loadRooms();
})();

/* ============================================================
   5. Reservations Page
   ============================================================ */
(function initReservationsPage() {
  var grid = document.getElementById('reservationsGrid');
  if (!grid) return; // not on reservations page

  var emptyState = document.getElementById('emptyState');
  var errorState = document.getElementById('errorState');
  var resultsCount = document.getElementById('resultsCount');
  var resultsNum = document.getElementById('resultsNum');

  /* ---- Load reservations from API ---- */
  window.loadReservations = function () {
    removeSkeletons();
    showSkeletons();
    hideEl(emptyState);
    hideEl(errorState);

    fetch(API_BASE + '/reservations')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var reservations = Array.isArray(data) ? data : [];
        removeSkeletons();
        renderReservations(reservations);
      })
      .catch(function () {
        removeSkeletons();
        showEl(errorState);
      });
  };

  /* ---- Render reservation cards ---- */
  function renderReservations(reservations) {
    var existing = grid.querySelectorAll('.reservation-card[data-rendered]');
    existing.forEach(function (el) { el.remove(); });

    if (reservations.length === 0) {
      showEl(emptyState);
      hideEl(resultsCount);
      return;
    }

    hideEl(emptyState);
    if (resultsCount) resultsCount.style.display = 'flex';
    if (resultsNum) resultsNum.textContent = String(reservations.length);

    var fragment = document.createDocumentFragment();
    reservations.forEach(function (r) {
      fragment.appendChild(buildReservationCard(r));
    });
    grid.appendChild(fragment);
  }

  /* ---- Build a single reservation card ---- */
  function buildReservationCard(r) {
    var room = r.room || {};
    var name = room.name || r.roomName || 'Unknown Room';
    var description = room.description || '';
    var equipments = Array.isArray(room.equipements) ? room.equipements : [];
    var date = r.date || r.reservationDate || '';

    var tagsHtml = equipments.length > 0
      ? equipments.map(function (e) {
          return '<span class="tag">' + escapeHtml(e.name || e) + '</span>';
        }).join('')
      : '';

    var card = document.createElement('article');
    card.className = 'reservation-card';
    card.setAttribute('data-rendered', '1');

    card.innerHTML =
      '<div class="reservation-card__header">' +
        '<div class="reservation-card__icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' +
          '</svg>' +
        '</div>' +
        '<div>' +
          '<h2 class="reservation-card__title">' + escapeHtml(name) + '</h2>' +
          (tagsHtml ? '<div class="reservation-card__tags" aria-label="Equipment">' + tagsHtml + '</div>' : '') +
        '</div>' +
      '</div>' +
      (description ? '<p class="reservation-card__desc">' + escapeHtml(description) + '</p>' : '') +
      '<div class="reservation-card__date" aria-label="Reservation date">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' +
        '</svg>' +
        '<span>' + formatDate(date) + '</span>' +
      '</div>';

    return card;
  }

  /* ---- Helpers ---- */
  function showSkeletons() {
    ['skel-1','skel-2','skel-3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }

  function removeSkeletons() {
    ['skel-1','skel-2','skel-3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function showEl(el) { if (el) el.style.display = 'flex'; }
  function hideEl(el) { if (el) el.style.display = 'none'; }

  /* ---- Boot ---- */
  loadReservations();
})();
