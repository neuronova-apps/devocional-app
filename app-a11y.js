(() => {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const appStatus = document.getElementById('appStatus');
  const journalText = document.getElementById('journalText');
  const saveJournalButton = document.getElementById('saveJournalBtn');
  const prayerList = document.getElementById('prayerList');
  const appTabs = [...document.querySelectorAll('.app-tabs [data-nav]')];
  const prayerTabs = [...document.querySelectorAll('[data-prayer-tab]')];
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let modalReturnFocus = null;

  function announce(message) {
    if (!appStatus || !message) return;
    appStatus.textContent = '';
    requestAnimationFrame(() => {
      appStatus.textContent = message;
    });
  }

  function sectionLabel(target) {
    const tab = appTabs.find(item => item.dataset.nav === target);
    return tab?.textContent.trim() || target;
  }

  function syncAppTabs(target) {
    appTabs.forEach(tab => {
      const selected = tab.dataset.nav === target;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function syncPrayerTabs(selectedValue) {
    prayerTabs.forEach(tab => {
      const selected = tab.dataset.prayerTab === selectedValue;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    const selectedTab = prayerTabs.find(tab => tab.dataset.prayerTab === selectedValue);
    if (prayerList && selectedTab?.id) {
      prayerList.setAttribute('aria-labelledby', selectedTab.id);
    }
  }

  function focusScreen(target) {
    const panel = document.getElementById(`${target}Screen`);
    if (!panel) return;
    requestAnimationFrame(() => panel.focus({ preventScroll: true }));
  }

  function activateAppTab(tab) {
    if (!tab) return;
    tab.focus();
    if (typeof window.navigate === 'function') window.navigate(tab.dataset.nav);
    syncAppTabs(tab.dataset.nav);
    announce(`Sección ${sectionLabel(tab.dataset.nav)}.`);
  }

  function handleRovingTabs(event, tabs, activate) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const currentIndex = tabs.indexOf(event.currentTarget);
    if (currentIndex < 0) return;

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    activate(tabs[nextIndex]);
  }

  appTabs.forEach(tab => {
    tab.addEventListener('keydown', event => handleRovingTabs(event, appTabs, activateAppTab));
    tab.addEventListener('click', () => {
      syncAppTabs(tab.dataset.nav);
      announce(`Sección ${sectionLabel(tab.dataset.nav)}.`);
    });
  });

  prayerTabs.forEach(tab => {
    tab.addEventListener('keydown', event => handleRovingTabs(event, prayerTabs, nextTab => {
      nextTab.focus();
      nextTab.click();
    }));
    tab.addEventListener('click', () => {
      syncPrayerTabs(tab.dataset.prayerTab);
      announce(`Oraciones ${tab.textContent.trim().toLowerCase()}.`);
    });
  });

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-nav]');
    if (!nav || nav.closest('.app-tabs')) return;
    const target = nav.dataset.nav;
    if (!target || !document.getElementById(`${target}Screen`)) return;
    requestAnimationFrame(() => {
      syncAppTabs(target);
      focusScreen(target);
      announce(`Sección ${sectionLabel(target)}.`);
    });
  });

  function currentModalFocusables() {
    if (!modalContent) return [];
    return [...modalContent.querySelectorAll(focusableSelector)].filter(element => {
      return !element.hasAttribute('hidden') && element.getClientRects().length > 0;
    });
  }

  function enhanceOpenModal() {
    if (!modalContent) return;
    const title = modalContent.querySelector('#modalTitle');
    if (title) {
      title.tabIndex = -1;
      requestAnimationFrame(() => title.focus({ preventScroll: true }));
      return;
    }
    requestAnimationFrame(() => {
      const first = currentModalFocusables()[0];
      (first || modalContent).focus({ preventScroll: true });
    });
  }

  if (typeof window.openModal === 'function') {
    const originalOpenModal = window.openModal;
    window.openModal = function accessibleOpenModal(html) {
      const wasClosed = modalBackdrop?.hidden !== false;
      if (wasClosed && document.activeElement instanceof HTMLElement) {
        modalReturnFocus = document.activeElement;
      }
      originalOpenModal(html);
      enhanceOpenModal();
    };
  }

  if (typeof window.closeModal === 'function') {
    const originalCloseModal = window.closeModal;
    window.closeModal = function accessibleCloseModal() {
      const returnTarget = modalReturnFocus;
      originalCloseModal();
      modalReturnFocus = null;
      if (returnTarget instanceof HTMLElement && returnTarget.isConnected) {
        requestAnimationFrame(() => returnTarget.focus({ preventScroll: true }));
      }
    };
  }

  document.addEventListener('keydown', event => {
    if (!modalBackdrop || modalBackdrop.hidden || event.key !== 'Tab') return;
    const focusables = currentModalFocusables();
    if (!focusables.length) {
      event.preventDefault();
      modalContent?.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function showFieldError(field, message) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    field.setCustomValidity(message);
    field.focus();
    field.reportValidity();
    announce(message);
  }

  modalContent?.addEventListener('input', event => {
    const field = event.target;
    if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && field.validity.customError && field.value.trim()) {
      field.setCustomValidity('');
    }
  });

  modalContent?.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const requiredTextFields = [...form.querySelectorAll('input[required], textarea[required]')];
    const emptyField = requiredTextFields.find(field => !field.value.trim());
    if (!emptyField) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showFieldError(emptyField, 'Completa este campo antes de guardar.');
  }, true);

  if (journalText) {
    journalText.setAttribute('aria-describedby', 'charCount');
    journalText.addEventListener('input', () => {
      if (journalText.validity.customError && journalText.value.trim()) journalText.setCustomValidity('');
    });
  }

  saveJournalButton?.addEventListener('click', event => {
    if (!journalText || journalText.value.trim()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showFieldError(journalText, 'Escribe una reflexión antes de guardar.');
  }, true);

  syncAppTabs('home');
  syncPrayerTabs('active');
})();
