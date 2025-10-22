# Security Patterns Library - CEPComunicación v2

**Última actualización:** 2025-10-22
**Estado:** Living Document (actualizado después de cada security review)

---

## Propósito

Este documento captura **patrones de seguridad aprobados** y **antipatrones detectados** durante el desarrollo de CEPComunicación v2.

**OBLIGATORIO:** Todo agente especializado DEBE consultar este documento antes de implementar nuevas colecciones.

---

## 🚨 Antipatrones Críticos Detectados

### AP-001: UI Security Theater

**❌ Antipatrón:**
```typescript
{
  name: 'sensitive_field',
  admin: {
    readOnly: true, // ⚠️ Solo protege UI, NO protege API
  },
}
```

**Impacto:**
- **Severidad:** HIGH
- **Vulnerabilidad:** Autenticación bypass, manipulación de datos críticos
- **Colecciones afectadas:** Courses (1 campo), Leads (12 campos)
- **Detección:** Security reviews #1 y #2

**✅ Patrón correcto:**
```typescript
{
  name: 'sensitive_field',
  admin: {
    readOnly: true, // Capa 1: UX (previene errores honestos)
  },
  access: {
    read: () => true,
    update: () => false, // Capa 2: Seguridad (previene ataques)
  },
}
```

**Lección aprendida:**
> En Payload CMS v3, `admin.readOnly` es una propiedad de PRESENTACIÓN, no de SEGURIDAD. Los controles de seguridad se implementan con `access.update`.

**Aplicar a:**
- Campos de auditoría (created_by, timestamps, IP addresses)
- Campos de consentimiento GDPR (gdpr_consent, privacy_policy_accepted)
- IDs de integraciones externas (mailchimp_subscriber_id, etc.)
- Cualquier campo auto-generado que no debe modificarse manualmente

---

## ✅ Patrones de Seguridad Aprobados

### SP-001: Campos Inmutables (Defense in Depth)

**Escenario:** Campo que se establece una vez y nunca debe cambiar.

**Ejemplos:** `created_by`, `consent_timestamp`, `consent_ip_address`, `gdpr_consent`

**Implementación:**
```typescript
{
  name: 'immutable_field',
  type: 'text',
  required: true, // Si aplica

  // Capa 1: UI/UX
  admin: {
    position: 'sidebar',
    readOnly: true, // Previene edición accidental en admin UI
    description: 'Auto-captured field (immutable)',
  },

  // Capa 2: API Security (CRÍTICO)
  access: {
    read: () => true, // Lectura permitida
    update: () => false, // Actualización BLOQUEADA
  },

  // Capa 3: Validación (opcional pero recomendada)
  validate: (val, { operation }) => {
    if (operation === 'update' && val !== originalValue) {
      return 'This field cannot be modified after creation';
    }
    return true;
  },
}
```

**Checklist:**
- [ ] `admin.readOnly: true` (UX layer)
- [ ] `access.update: () => false` (Security layer)
- [ ] Comentario explicando por qué es inmutable
- [ ] Test de seguridad verifica que UPDATE falla

---

### SP-002: Campos GDPR Críticos

**Escenario:** Campos relacionados con consentimiento GDPR que requieren inmutabilidad legal.

**Ejemplos:** `gdpr_consent`, `privacy_policy_accepted`, `consent_timestamp`, `consent_ip_address`

**Implementación:**
```typescript
// Ejemplo: Campo de consentimiento GDPR
{
  name: 'gdpr_consent',
  type: 'checkbox',
  required: true,
  defaultValue: false,

  admin: {
    position: 'sidebar',
    readOnly: true, // UI: no editable después de creación
    description: 'REQUIRED: GDPR consent (immutable after creation)',
  },

  // SECURITY: Inmutable después de creación
  access: {
    read: () => true,
    update: () => false, // Previene manipulación de consentimiento
  },

  // VALIDATION: Debe ser explícitamente true
  validate: (val: boolean | undefined) => {
    if (val !== true) {
      return 'GDPR consent is required and must be explicitly accepted';
    }
    return true;
  },
}
```

**Metadata de consentimiento:**
```typescript
// Timestamp de consentimiento
{
  name: 'consent_timestamp',
  type: 'date',
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'When consent was given (auto-captured, immutable)',
  },
  access: {
    read: () => true,
    update: () => false, // CRÍTICO: Auditoría GDPR
  },
}

// IP address de consentimiento
{
  name: 'consent_ip_address',
  type: 'text',
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'IP when consent was given (PII, immutable)',
  },
  access: {
    read: () => true,
    update: () => false, // CRÍTICO: Auditoría GDPR
  },
}
```

**Checklist GDPR:**
- [ ] Consentimiento requiere `validate: (val) => val === true`
- [ ] Timestamp inmutable con `access.update: () => false`
- [ ] IP address inmutable con `access.update: () => false`
- [ ] Hook `beforeValidate` captura metadata automáticamente
- [ ] Tests verifican que consentimiento no puede revocarse vía API
- [ ] Database tiene CHECK constraints: `CHECK (gdpr_consent = true)`

---

### SP-003: Ownership-Based Permissions

**Escenario:** Usuario debe poder editar solo sus propios recursos.

**Ejemplos:** Marketing edita solo sus cursos, Asesor edita solo sus leads asignados.

**Implementación:**
```typescript
// Campo de tracking de creador
{
  name: 'created_by',
  type: 'relationship',
  relationTo: 'users',

  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'User who created this resource',
  },

  // SECURITY: Previene manipulación de ownership
  access: {
    read: () => true,
    update: () => false, // No se puede cambiar el creador
  },
}

// Access control para updates
export const canUpdateResource: Access = ({ req: { user } }) => {
  if (!user) return false;

  // Admin y Gestor: acceso total
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: solo sus propios recursos
  if (user.role === 'marketing') {
    return {
      created_by: { equals: user.id }, // Query constraint
    };
  }

  return false;
};
```

**Checklist:**
- [ ] `created_by` field con `access.update: () => false`
- [ ] Hook `beforeValidate` establece `created_by` automáticamente
- [ ] Access control usa query constraints `{ created_by: { equals: user.id } }`
- [ ] Tests verifican que Marketing no puede editar recursos de otros
- [ ] Tests verifican que no se puede manipular `created_by` vía API

---

### SP-004: PII Data Handling (GDPR Compliance)

**Escenario:** Manejo de datos personales identificables (PII) según GDPR.

**Ejemplos PII:** email, phone, first_name, last_name, IP address, message, notes

**Reglas estrictas:**

**1. NO LOGGING DE PII**
```typescript
// ❌ PROHIBIDO
console.log(`Lead created: ${doc.email}`); // PII en logs
console.log(`Phone: ${doc.phone}`); // PII en logs
console.log(`IP: ${doc.consent_ip_address}`); // PII en logs

// ✅ PERMITIDO
console.log(`Lead created: ${doc.id}`); // ID no es PII
console.log(`Lead score: ${doc.lead_score}`); // Métrica no es PII
req.payload.logger.info('[Lead] Created', {
  id: doc.id,
  hasEmail: !!doc.email, // Boolean, no PII
  leadScore: doc.lead_score,
});
```

**2. Field-Level Access Control para PII sensible**
```typescript
{
  name: 'email',
  type: 'email',
  required: true,

  // PII sensible: control de acceso granular
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false; // Public no puede leer emails
      // Solo roles con permiso leen PII
      return ['admin', 'gestor', 'marketing'].includes(user.role);
    },
    update: ({ req: { user } }) => {
      // Similar control para updates
      return ['admin', 'gestor'].includes(user.role);
    },
  },
}
```

**3. Minimización de datos**
```typescript
// ❌ NO capturar PII innecesario
{
  name: 'social_security_number', // ❌ No necesario para leads
  name: 'date_of_birth', // ❌ No necesario
  name: 'home_address', // ❌ No necesario
}

// ✅ Solo PII mínimo necesario
{
  name: 'email', // ✅ Necesario para contacto
  name: 'phone', // ✅ Necesario para contacto
  name: 'first_name', // ✅ Necesario para personalización
}
```

**Checklist PII:**
- [ ] NO logging de emails, phones, nombres, IP addresses
- [ ] Field-level access control en campos PII sensibles
- [ ] Public no puede READ PII (solo CREATE con sus propios datos)
- [ ] Minimización: solo capturar PII estrictamente necesario
- [ ] Documentar base legal para procesar cada campo PII
- [ ] Tests verifican que public no puede leer PII de otros

---

### SP-005: External Integration IDs (Immutable References)

**Escenario:** IDs asignados por servicios externos (MailChimp, WhatsApp, Stripe, etc.)

**Ejemplos:** `mailchimp_subscriber_id`, `whatsapp_contact_id`, `stripe_customer_id`

**Implementación:**
```typescript
{
  name: 'mailchimp_subscriber_id',
  type: 'text',
  maxLength: 255,

  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'MailChimp subscriber ID (auto-populated by integration)',
  },

  // SECURITY: Previene manipulación de IDs externos
  access: {
    read: () => true,
    update: () => false, // Solo workers pueden establecer esto
  },
}
```

**Razón:** Modificar estos IDs manualmente rompe la sincronización con servicios externos y puede causar:
- Duplicación de registros
- Pérdida de datos
- Inconsistencias entre sistemas
- Fallos en integraciones

**Checklist:**
- [ ] `access.update: () => false` en todos los external IDs
- [ ] Solo jobs/workers establecen estos valores vía hook `afterChange`
- [ ] Tests verifican que API no puede modificar external IDs
- [ ] Documentar qué servicio controla cada ID

---

### SP-006: Auto-Populated Timestamps (Audit Trail)

**Escenario:** Timestamps generados automáticamente para auditoría.

**Ejemplos:** `created_at`, `updated_at`, `last_contacted_at`, `converted_at`

**Implementación:**
```typescript
// Timestamps automáticos (built-in de Payload)
{
  timestamps: true, // Genera created_at y updated_at automáticamente
}

// Timestamps de negocio (custom)
{
  name: 'converted_at',
  type: 'date',

  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'When lead was converted (auto-set on status change)',
  },

  // SECURITY: Previene manipulación de métricas
  access: {
    read: () => true,
    update: () => false, // Solo hooks pueden modificar
  },
}

// Hook para establecer timestamp automáticamente
{
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Establecer converted_at cuando status cambia a 'converted'
        if (data.status === 'converted' && !data.converted_at) {
          data.converted_at = new Date().toISOString();
        }
        return data;
      },
    ],
  },
}
```

**Checklist:**
- [ ] Usar `timestamps: true` para created_at/updated_at built-in
- [ ] Custom timestamps con `access.update: () => false`
- [ ] Hooks establecen timestamps, NO usuarios vía API
- [ ] Tests verifican que timestamps no pueden manipularse
- [ ] Formato ISO 8601 para todas las fechas

---

## 🔍 Checklist de Seguridad Pre-Commit

**Antes de cada commit, verificar:**

### Nivel de Campo
- [ ] ¿Hay campos con `admin.readOnly: true`?
  - [ ] ¿Tienen `access.update: () => false`?
  - [ ] ¿Por qué son read-only? (documentar en comentario)

- [ ] ¿Hay campos de consentimiento GDPR?
  - [ ] `gdpr_consent` con validación `val === true`
  - [ ] `consent_timestamp` inmutable
  - [ ] `consent_ip_address` inmutable
  - [ ] Hook captura metadata automáticamente

- [ ] ¿Hay campos PII (email, phone, nombres)?
  - [ ] NO hay logging de PII en hooks
  - [ ] Field-level access control apropiado
  - [ ] Public no puede READ PII de otros

- [ ] ¿Hay IDs externos (MailChimp, Stripe, etc.)?
  - [ ] `access.update: () => false`
  - [ ] Solo workers pueden establecerlos

- [ ] ¿Hay timestamps de auditoría?
  - [ ] `access.update: () => false`
  - [ ] Solo hooks los modifican

### Nivel de Colección
- [ ] Access control por rol implementado
  - [ ] Public: solo CREATE (si aplica)
  - [ ] Lectura: control granular por rol
  - [ ] Update: ownership-based si aplica
  - [ ] Delete: solo Admin/Gestor

- [ ] Hooks no contienen:
  - [ ] Logging de PII (emails, phones, IPs)
  - [ ] Secrets hardcoded
  - [ ] SQL/NoSQL injection risks

### Nivel de Tests
- [ ] Tests de inmutabilidad:
  - [ ] Intentar UPDATE en campos read-only DEBE FALLAR
  - [ ] GDPR consent no puede revocarse vía API
  - [ ] External IDs no pueden modificarse

- [ ] Tests de access control:
  - [ ] Public no puede READ PII
  - [ ] Marketing solo edita sus recursos
  - [ ] Roles tienen permisos correctos

### Antes de Security Review
- [ ] Ejecutar `/security-review` ANTES de commit
- [ ] Corregir TODAS las vulnerabilidades HIGH
- [ ] Documentar vulnerabilidades MEDIUM encontradas
- [ ] Actualizar este documento con nuevos patrones

---

## 📚 Referencias

### Payload CMS v3 Security Best Practices
- **Field-level access control:** https://payloadcms.com/docs/access-control/fields
- **Admin config vs Security:** `admin.readOnly` ≠ `access.update`
- **Access control retorna queries:** Para ownership-based permissions

### GDPR Requirements
- **Article 7:** Conditions for consent (must be explicit, must be provable)
- **Article 17:** Right to erasure
- **Article 30:** Records of processing activities (audit trail)

### Patrones de Seguridad
- **Defense in Depth:** Múltiples capas de seguridad
- **Principle of Least Privilege:** Mínimos permisos necesarios
- **Immutability:** Datos críticos no deben cambiar después de creación

---

## 🔄 Historial de Actualizaciones

| Fecha | Cambio | Razón |
|-------|--------|-------|
| 2025-10-22 | Documento inicial creado | Detectado antipatrón UI Security Theater en Courses y Leads |
| 2025-10-22 | Agregados 6 patrones de seguridad | Generalización de fixes aplicados |
| 2025-10-22 | Agregado checklist pre-commit | Prevenir repetición de vulnerabilidades |

---

## ⚠️ Instrucciones para Agentes

**OBLIGATORIO para todos los agentes especializados:**

1. **Antes de implementar una nueva colección:**
   - [ ] Leer este documento completo
   - [ ] Identificar qué patrones aplican (GDPR, immutable fields, etc.)
   - [ ] Aplicar TODOS los patrones relevantes desde el inicio

2. **Durante la implementación:**
   - [ ] Consultar checklist para cada campo
   - [ ] Documentar decisiones de seguridad en comentarios
   - [ ] Implementar tests de seguridad

3. **Después de implementar:**
   - [ ] Ejecutar `/security-review`
   - [ ] Si se detectan vulnerabilidades, actualizar este documento con nuevos patrones
   - [ ] Verificar checklist pre-commit

**Nota crítica:** Este documento es **living** y debe actualizarse después de cada security review exitoso o fallido.

---

**Mantenedores:** @payload-cms-architect, @security-gdpr-compliance
**Revisión requerida:** Después de cada colección implementada
