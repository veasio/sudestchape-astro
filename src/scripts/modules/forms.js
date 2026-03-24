/**
 * Module Forms - sudestchape
 * Validation côté client des formulaires, messages d'erreur accessibles,
 * gestion des états visuels et injection UTM dans les champs cachés.
 *
 * Compatible avec les formulaires Mautic (.mauticform-*) et
 * les formulaires natifs (.form-group).
 *
 * @module forms
 */

import { getUtmParams } from './analytics.js';

/** Sélecteurs */
const SELECTORS = {
    form: 'form[data-validate], .mautic-form form',
    input: '.form-input, .form-textarea, .form-select, .mauticform-input, .mauticform-textarea, .mauticform-selectbox',
    group: '.form-group, .mauticform-row',
    errorMsg: '.form-message--error, .mauticform-errormsg',
};

/** Messages de validation par défaut */
const MESSAGES = {
    required: 'Ce champ est obligatoire.',
    email: 'Veuillez saisir une adresse email valide.',
    phone: 'Veuillez saisir un numéro de téléphone valide.',
    minlength: (n) => `Ce champ doit contenir au moins ${n} caractères.`,
    maxlength: (n) => `Ce champ ne doit pas dépasser ${n} caractères.`,
};

/** Pattern email simple */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pattern téléphone FR */
const PHONE_REGEX = /^[\d\s.+()-]{10,}$/;

/**
 * Initialise la validation sur tous les formulaires de la page.
 */
export function init() {
    const forms = document.querySelectorAll(SELECTORS.form);
    forms.forEach((form) => setupForm(form));

    injectUtmParams();

    // Observer les formulaires Mautic injectés dynamiquement
    observeMauticForms();
}

/**
 * Configure un formulaire : listeners de validation.
 *
 * @param {HTMLFormElement} form
 */
function setupForm(form) {
    // Validation au submit
    form.addEventListener('submit', (e) => {
        clearAllErrors(form);
        const isValid = validateForm(form);

        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();

            // Focus sur le premier champ en erreur
            const firstError = form.querySelector('.form-group--error input, .form-group--error textarea, .form-group--error select, .mauticform-has-error input, .mauticform-has-error textarea');
            if (firstError) firstError.focus();

            // Annoncer l'erreur (accessibilité)
            announceError(form);
        }
    });

    // Validation en temps réel au blur
    const inputs = form.querySelectorAll(SELECTORS.input);
    inputs.forEach((input) => {
        input.addEventListener('blur', () => {
            const group = input.closest(SELECTORS.group);
            if (group) {
                clearGroupError(group);
                validateField(input, group);
            }
        });

        // Effacer l'erreur quand l'utilisateur commence à taper
        input.addEventListener('input', () => {
            const group = input.closest(SELECTORS.group);
            if (group && group.classList.contains('form-group--error')) {
                clearGroupError(group);
            }
        });
    });
}

/**
 * Valide tous les champs d'un formulaire.
 *
 * @param {HTMLFormElement} form
 * @returns {boolean} true si valide
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll(SELECTORS.input);

    inputs.forEach((input) => {
        const group = input.closest(SELECTORS.group);
        if (group && !validateField(input, group)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Valide un champ individuel.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input
 * @param {HTMLElement} group - Conteneur .form-group
 * @returns {boolean} true si valide
 */
function validateField(input, group) {
    const value = input.value.trim();
    const isRequired = input.required || input.hasAttribute('data-required') || group.classList.contains('mauticform-required');
    const type = input.type || input.dataset.type || '';
    const minLength = parseInt(input.getAttribute('minlength'), 10);
    const maxLength = parseInt(input.getAttribute('maxlength'), 10);

    // Required
    if (isRequired && value === '') {
        showError(group, input, MESSAGES.required);
        return false;
    }

    // Email
    if (value && (type === 'email' || input.name?.includes('email'))) {
        if (!EMAIL_REGEX.test(value)) {
            showError(group, input, MESSAGES.email);
            return false;
        }
    }

    // Téléphone
    if (value && (type === 'tel' || input.name?.includes('phone') || input.name?.includes('telephone'))) {
        if (!PHONE_REGEX.test(value)) {
            showError(group, input, MESSAGES.phone);
            return false;
        }
    }

    // Min length
    if (value && !isNaN(minLength) && value.length < minLength) {
        showError(group, input, MESSAGES.minlength(minLength));
        return false;
    }

    // Max length
    if (value && !isNaN(maxLength) && value.length > maxLength) {
        showError(group, input, MESSAGES.maxlength(maxLength));
        return false;
    }

    return true;
}

/**
 * Affiche un message d'erreur accessible sur un groupe de champ.
 *
 * @param {HTMLElement} group - Conteneur du champ
 * @param {HTMLElement} input - Champ en erreur
 * @param {string} message   - Message d'erreur
 */
function showError(group, input, message) {
    group.classList.add('form-group--error');

    // Ajouter la classe Mautic si applicable
    if (group.classList.contains('mauticform-row')) {
        group.classList.add('mauticform-has-error');
    }

    // Créer le message d'erreur s'il n'existe pas
    let errorEl = group.querySelector(SELECTORS.errorMsg);
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-message form-message--error';
        errorEl.setAttribute('role', 'alert');
        group.appendChild(errorEl);
    }

    // ID unique pour aria-describedby
    const errorId = `error-${input.name || input.id || Math.random().toString(36).slice(2)}`;
    errorEl.id = errorId;
    errorEl.textContent = message;

    // Lier le champ au message d'erreur (accessibilité)
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
}

/**
 * Efface l'erreur d'un groupe de champ.
 *
 * @param {HTMLElement} group
 */
function clearGroupError(group) {
    group.classList.remove('form-group--error', 'mauticform-has-error');

    const errorEl = group.querySelector(SELECTORS.errorMsg);
    if (errorEl) errorEl.remove();

    const input = group.querySelector(SELECTORS.input);
    if (input) {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    }
}

/**
 * Efface toutes les erreurs d'un formulaire.
 *
 * @param {HTMLFormElement} form
 */
function clearAllErrors(form) {
    const groups = form.querySelectorAll(SELECTORS.group);
    groups.forEach((group) => clearGroupError(group));
}

/**
 * Annonce une erreur globale via une ARIA live region.
 *
 * @param {HTMLFormElement} form
 */
function announceError(form) {
    let liveRegion = form.querySelector('.form-announce');

    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.className = 'form-announce sr-only';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        form.prepend(liveRegion);
    }

    const errorCount = form.querySelectorAll('.form-group--error, .mauticform-has-error').length;
    liveRegion.textContent = `Le formulaire contient ${errorCount} erreur${errorCount > 1 ? 's' : ''}. Veuillez corriger les champs indiqués.`;
}

/**
 * Injecte les paramètres UTM dans les champs cachés de tous les formulaires.
 * Cherche des champs nommés utm_source, utm_medium, etc.
 * Crée des champs cachés s'ils n'existent pas.
 */
function injectUtmParams() {
    const utmParams = getUtmParams();

    if (Object.keys(utmParams).length === 0) return;

    document.querySelectorAll('form').forEach((form) => {
        Object.entries(utmParams).forEach(([key, value]) => {
            // Chercher un champ existant
            let input = form.querySelector(`input[name="${key}"], input[name="mauticform[${key}]"]`);

            if (input) {
                input.value = value;
            } else {
                // Créer un champ caché
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
        });
    });
}

/**
 * Observe le DOM pour détecter les formulaires Mautic injectés dynamiquement
 * et leur appliquer la validation et l'injection UTM.
 */
function observeMauticForms() {
    if (!('MutationObserver' in window)) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                // Formulaire Mautic injecté
                const mauticForms = node.querySelectorAll
                    ? node.querySelectorAll('.mautic-form form, .mauticform_wrapper form')
                    : [];

                mauticForms.forEach((form) => {
                    setupForm(form);
                    injectUtmParams();
                });
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
