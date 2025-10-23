/**
 * LeadForm Component
 *
 * GDPR-compliant lead capture form with validation
 *
 * Features:
 * - Spanish phone validation (+34 XXX XXX XXX)
 * - Required GDPR consent checkboxes
 * - UTM parameter capture from URL
 * - Real-time validation
 * - Success/error feedback
 * - Loading states
 */

import { useState, FormEvent } from 'react';
import { Input, TextArea, Select, Checkbox, Button, Alert } from '@components/ui';
import { useLeadSubmit, validateLeadForm } from '@hooks/useLeadSubmit';
import { useCourses } from '@hooks/useCourses';
import { useCampuses } from '@hooks/useCampuses';
import type { LeadFormData, LeadFormErrors } from '@types/index';

export interface LeadFormProps {
  defaultCourseId?: string;
  defaultCampusId?: string;
  onSuccess?: () => void;
}

export function LeadForm({ defaultCourseId, defaultCampusId, onSuccess }: LeadFormProps) {
  // Fetch courses and campuses for dropdowns
  const coursesState = useCourses({ featured: undefined });
  const campusesState = useCampuses();

  // Form submission hook
  const { isSubmitting, isSuccess, error: submitError, submitLead, resetState } = useLeadSubmit();

  // Form data state
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    course: defaultCourseId || '',
    campus: defaultCampusId || '',
    message: '',
    gdpr_consent: false,
    privacy_policy_accepted: false,
  });

  // Validation errors
  const [errors, setErrors] = useState<LeadFormErrors>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof LeadFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit form
    const success = await submitLead(formData);

    if (success) {
      // Reset form on success
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        course: defaultCourseId || '',
        campus: defaultCampusId || '',
        message: '',
        gdpr_consent: false,
        privacy_policy_accepted: false,
      });
      setErrors({});

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  // Show success message
  if (isSuccess) {
    return (
      <div className="card">
        <Alert variant="success" title="¡Solicitud Enviada!">
          <p className="mb-4">
            Hemos recibido tu solicitud correctamente. Nuestro equipo se pondrá en contacto contigo
            en las próximas 24-48 horas.
          </p>
          <Button onClick={resetState} variant="outline" size="sm">
            Enviar Otra Solicitud
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6">Solicita Información</h2>

      {submitError && (
        <Alert variant="error" title="Error al Enviar" onClose={() => resetState()}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <Input
          label="Nombre"
          name="first_name"
          type="text"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
          required
          placeholder="Tu nombre"
          autoComplete="given-name"
        />

        {/* Last Name */}
        <Input
          label="Apellidos"
          name="last_name"
          type="text"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
          required
          placeholder="Tus apellidos"
          autoComplete="family-name"
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="tu@email.com"
          autoComplete="email"
        />

        {/* Phone */}
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="+34 600 123 456"
          autoComplete="tel"
          helperText="Formato: +34 XXX XXX XXX"
        />

        {/* Course Selection */}
        {coursesState.status === 'success' && coursesState.data && (
          <Select
            label="Curso de Interés"
            name="course"
            value={formData.course}
            onChange={handleChange}
            error={errors.course}
            placeholder="Selecciona un curso"
            options={[
              ...coursesState.data.map((course) => ({
                value: course.id,
                label: course.title,
              })),
            ]}
          />
        )}

        {/* Campus Selection */}
        {campusesState.status === 'success' && campusesState.data && (
          <Select
            label="Campus Preferido"
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            error={errors.campus}
            placeholder="Selecciona un campus"
            options={[
              ...campusesState.data.map((campus) => ({
                value: campus.id,
                label: `${campus.name} - ${campus.city}`,
              })),
            ]}
          />
        )}

        {/* Message */}
        <TextArea
          label="Mensaje"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          placeholder="¿Tienes alguna pregunta o necesitas información adicional?"
          rows={4}
          helperText="Máximo 1000 caracteres"
        />

        {/* GDPR Compliance - CRITICAL */}
        <div className="border-t border-neutral-200 pt-4 mt-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Protección de Datos Personales (RGPD)
          </h3>

          {/* Privacy Policy Acceptance */}
          <Checkbox
            name="privacy_policy_accepted"
            checked={formData.privacy_policy_accepted}
            onChange={handleChange}
            error={errors.privacy_policy_accepted}
            required
            label={
              <span>
                Acepto la{' '}
                <a
                  href="/politica-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  política de privacidad
                </a>
              </span>
            }
          />

          {/* GDPR Consent */}
          <Checkbox
            name="gdpr_consent"
            checked={formData.gdpr_consent}
            onChange={handleChange}
            error={errors.gdpr_consent}
            required
            label={
              <span>
                Consiento el tratamiento de mis datos personales para recibir información sobre
                cursos, convocatorias y servicios de CEP Formación
              </span>
            }
          />

          <p className="mt-4 text-xs text-neutral-500">
            Tus datos personales serán tratados de acuerdo con nuestra política de privacidad.
            Tienes derecho de acceso, rectificación, supresión, limitación, portabilidad y
            oposición. Para más información, consulta nuestra{' '}
            <a href="/politica-privacidad" className="text-primary hover:underline">
              política de privacidad
            </a>
            .
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>

        <p className="text-xs text-neutral-500 text-center">
          * Campos obligatorios
        </p>
      </form>
    </div>
  );
}
