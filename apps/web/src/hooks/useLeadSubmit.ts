/**
 * useLeadSubmit Hook
 *
 * Custom hook for submitting lead forms with GDPR compliance
 */

import { useState } from 'react';
import { api } from '@api/client';
import type { LeadFormData, LeadFormErrors } from '../types';

interface SubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export function useLeadSubmit() {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  const submitLead = async (data: LeadFormData): Promise<boolean> => {
    setState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      // Capture UTM parameters from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const utmData = {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
      };

      await api.leads.create({
        ...data,
        ...utmData,
      });

      setState({ isSubmitting: false, isSuccess: true, error: null });
      return true;
    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Failed to submit form',
      });
      return false;
    }
  };

  const resetState = () => {
    setState({ isSubmitting: false, isSuccess: false, error: null });
  };

  return {
    ...state,
    submitLead,
    resetState,
  };
}

/**
 * validateLeadForm
 *
 * Client-side validation for lead form
 */
export function validateLeadForm(data: LeadFormData): LeadFormErrors {
  const errors: LeadFormErrors = {};

  // First name validation
  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.first_name = 'El nombre es obligatorio';
  } else if (data.first_name.length < 2) {
    errors.first_name = 'El nombre debe tener al menos 2 caracteres';
  } else if (data.first_name.length > 50) {
    errors.first_name = 'El nombre no puede exceder 50 caracteres';
  }

  // Last name validation
  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.last_name = 'Los apellidos son obligatorios';
  } else if (data.last_name.length < 2) {
    errors.last_name = 'Los apellidos deben tener al menos 2 caracteres';
  } else if (data.last_name.length > 100) {
    errors.last_name = 'Los apellidos no pueden exceder 100 caracteres';
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'El email no tiene un formato válido';
  }

  // Phone validation (Spanish format)
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'El teléfono es obligatorio';
  } else {
    // Remove spaces and special characters for validation
    const cleanPhone = data.phone.replace(/[\s-]/g, '');

    // Spanish phone format: +34 XXX XXX XXX (mobile or landline)
    if (!/^\+34[6-9]\d{8}$/.test(cleanPhone)) {
      errors.phone = 'El teléfono debe tener formato español (+34 XXX XXX XXX)';
    }
  }

  // Message validation (optional, but if provided must be within limits)
  if (data.message && data.message.length > 1000) {
    errors.message = 'El mensaje no puede exceder 1000 caracteres';
  }

  // GDPR consent validation (CRITICAL)
  if (!data.gdpr_consent) {
    errors.gdpr_consent = 'Debes aceptar el consentimiento RGPD para continuar';
  }

  // Privacy policy validation (CRITICAL)
  if (!data.privacy_policy_accepted) {
    errors.privacy_policy_accepted = 'Debes aceptar la política de privacidad para continuar';
  }

  return errors;
}
