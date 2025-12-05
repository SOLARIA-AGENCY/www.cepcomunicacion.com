# PROMPT DE DISEÑO: PROGRAMACIÓN Y PLANNER VISUAL
## Sistema de Planificación de Horarios y Gestión de Recursos Académicos

---

## 1. CONTEXTO Y OBJETIVOS

### 1.1 Propósito
Desarrollar un sistema dual de planificación académica que permita a los administradores:
- **Programación**: Crear y gestionar convocatorias de cursos con asignación de recursos
- **Planner Visual**: Visualizar y resolver conflictos de horarios en tiempo real

### 1.2 Problema a Resolver
**Pain Point Principal**: Evitar conflictos de recursos (aulas, profesores) al planificar el calendario académico del centro.

**Restricciones Críticas**:
1. **Aula única**: Una aula NO puede tener dos clases simultáneas
2. **Profesor único**: Un profesor NO puede estar en dos lugares al mismo tiempo
3. **Desplazamiento entre sedes**: Mínimo 2 horas entre clases si el profesor debe cambiar de sede
4. **Capacidad del aula**: No exceder la capacidad máxima de estudiantes por aula
5. **Horario laboral**: Respetar franjas horarias permitidas (lunes-viernes 8:00-22:00)

### 1.3 Usuarios Objetivo
- **Admin/Gestor**: Planificación completa del centro (todas las sedes)
- **Coordinador de Sede**: Planificación de su sede específica
- **Profesor**: Consulta de su horario personal (solo lectura)

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Sección 1: PROGRAMACIÓN (Formulario de Convocatorias)

**Ruta**: `/programacion`

**Propósito**: Interface de gestión para crear/editar convocatorias de cursos con asignación completa de recursos.

#### Modelo de Datos: `Convocatoria`

```typescript
interface Convocatoria {
  id: string

  // Relaciones
  curso: Curso                          // Curso a impartir
  sede: Sede                            // Sede donde se imparte
  aula: Aula                            // Aula asignada
  profesor_principal: Profesor          // Profesor responsable
  profesores_secundarios?: Profesor[]   // Profesores de apoyo (opcional)

  // Temporalidad
  fecha_inicio: Date                    // Inicio de la convocatoria
  fecha_fin: Date                       // Fin de la convocatoria
  horario_semanal: HorarioSemanal[]     // Slots de tiempo semanales

  // Capacidad
  plazas_totales: number                // Capacidad máxima
  plazas_ocupadas: number               // Plazas reservadas
  plazas_disponibles: number            // Calculado: totales - ocupadas
  lista_espera: number                  // Estudiantes en espera

  // Estado
  estado: 'planificada' | 'abierta' | 'en_curso' | 'completada' | 'cancelada'

  // Metadata
  created_by: User
  created_at: Date
  updated_at: Date
  conflictos?: Conflicto[]              // Conflictos detectados
}

interface HorarioSemanal {
  dia: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado'
  hora_inicio: string                   // Formato: "09:00"
  hora_fin: string                      // Formato: "11:00"
  duracion_minutos: number              // Calculado automáticamente
}

interface Aula {
  id: string
  nombre: string                        // Ej: "Aula A1", "Lab Informática 2"
  codigo: string                        // Ej: "A1", "LAB-INF-02"
  sede: Sede
  capacidad: number                     // Máximo de estudiantes
  tipo: 'teoria' | 'laboratorio' | 'taller' | 'seminario'
  equipamiento: string[]                // ["proyector", "ordenadores", "pizarra digital"]
  activa: boolean
}

interface Conflicto {
  tipo: 'aula_ocupada' | 'profesor_ocupado' | 'profesor_desplazamiento' | 'capacidad_excedida'
  severidad: 'error' | 'warning'
  mensaje: string
  convocatoria_conflictiva?: string     // ID de la otra convocatoria en conflicto
  sugerencias?: string[]                // Posibles soluciones
}
```

#### Funcionalidades de Programación

**Vista Principal**:
```
┌─────────────────────────────────────────────────────────────┐
│  PROGRAMACIÓN DE CONVOCATORIAS                              │
├─────────────────────────────────────────────────────────────┤
│  Filtros:  [Sede ▼]  [Curso ▼]  [Estado ▼]  [🔍 Buscar]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Resumen:  25 Convocatorias  |  18 Activas  |  3 ⚠️      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📚 Marketing Digital Avanzado                        │  │
│  │ 📍 CEP Norte - Aula A1 (Cap: 25/30)                 │  │
│  │ 👨‍🏫 Prof. Juan García                                │  │
│  │ 📅 L-X-V: 09:00-11:00  |  15 ene - 30 mar 2025     │  │
│  │ ⚠️ Conflicto: Aula ocupada miércoles 10:00         │  │
│  │ [Ver Calendario] [Editar] [Resolver Conflictos]     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [+ Nueva Convocatoria]                                     │
└─────────────────────────────────────────────────────────────┘
```

**Formulario de Creación/Edición**:

```
┌─────────────────────────────────────────────────────────────┐
│  NUEVA CONVOCATORIA                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1️⃣ SELECCIÓN DE CURSO                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Curso: [Marketing Digital Avanzado ▼]              │    │
│  │ Duración: 60 horas | Modalidad: Presencial         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  2️⃣ ASIGNACIÓN DE RECURSOS                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Sede: [CEP Norte ▼]                                │    │
│  │ Aula: [Aula A1 (Cap: 30) ▼]  💡 Ver disponibilidad│    │
│  │ Profesor Principal: [Juan García ▼]  📅 Ver agenda│    │
│  │ Profesores Apoyo: [+ Añadir]                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  3️⃣ CONFIGURACIÓN DE HORARIO                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Fecha inicio: [15/01/2025]                         │    │
│  │ Fecha fin: [30/03/2025]                            │    │
│  │                                                     │    │
│  │ Horario Semanal:                                   │    │
│  │ ┌─────────────────────────────────────────────┐   │    │
│  │ │ ☑️ Lunes    09:00 - 11:00  (2h)  [✕]        │   │    │
│  │ │ ☐ Martes   [Añadir horario]                 │   │    │
│  │ │ ☑️ Miércoles 09:00 - 11:00  (2h)  [✕]       │   │    │
│  │ │ ☐ Jueves   [Añadir horario]                 │   │    │
│  │ │ ☑️ Viernes   09:00 - 11:00  (2h)  [✕]       │   │    │
│  │ │ ☐ Sábado   [Añadir horario]                 │   │    │
│  │ └─────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │ Total horas semanales: 6h  |  Duración: 10 semanas│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  4️⃣ CAPACIDAD Y ESTADO                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Plazas totales: [25]                               │    │
│  │ Estado inicial: [Planificada ▼]                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ⚠️ VALIDACIÓN AUTOMÁTICA                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ✅ Aula disponible en horarios seleccionados       │    │
│  │ ✅ Profesor disponible                             │    │
│  │ ✅ Capacidad aula suficiente (25 ≤ 30)            │    │
│  │ ❌ CONFLICTO: Profesor tiene clase en CEP Sur     │    │
│  │    miércoles 10:00-12:00 (necesita 2h desplaz.)   │    │
│  │    💡 Sugerencia: Cambiar a 14:00-16:00           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Cancelar]  [Guardar como Borrador]  [💾 Crear y Validar] │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Sección 2: PLANNER VISUAL (Calendario Interactivo)

**Ruta**: `/planner`

**Propósito**: Visualización tipo Gantt/Calendario de todas las convocatorias con detección visual de conflictos y drag-and-drop para reorganizar.

#### Vista Principal del Planner

**Layout de 3 Paneles**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PLANNER VISUAL - CEP NORTE                        [Cambiar Sede ▼]         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📅 Semana: [← 20-26 Enero 2025 →]  |  Vista: [Semanal ▼] [Mensual]       │
│  Filtros: [🏫 Todas las aulas]  [👨‍🏫 Todos los profesores]  [📚 Todos]     │
│                                                                              │
├──────────────┬──────────────────────────────────────────────────────────────┤
│              │                  CALENDARIO VISUAL                           │
│  LEYENDA     │                                                              │
│              │   Hora │ Aula A1  │ Aula A2  │ Lab Inf 1│ Aula B1  │ ...   │
│ 🟦 Curso     ├───────┼──────────┼──────────┼──────────┼──────────┼────   │
│    Activo    │ 08:00 │          │          │          │          │        │
│              │       │          │          │          │          │        │
│ 🟨 Curso     │ 09:00 │┌────────┐│          │          │          │        │
│    Planif.   │       ││Marketing││          │          │          │        │
│              │ 10:00 ││Digital ││          │┌────────┐│          │        │
│ 🟥 Conflicto │       ││J.García││          ││  SEO   ││          │        │
│              │ 11:00 │└────────┘│          ││M.López ││          │        │
│ 🟩 Libre     │       │          │          │└────────┘│          │        │
│              │ 12:00 │   LIBRE  │┌────────┐│          │┌────────┐│        │
│ ⚪ Descanso  │       │          ││DesarroWeb          ││AdminFinan        │
│              │ 13:00 │          ││A.Ruiz  ││          ││L.Sánchez│        │
│              │ 14:00 │          │└────────┘│          │└────────┘│        │
│ 🎯 Vista:    │       │          │          │          │          │        │
│ [Aulas]      │ 15:00 │          │          │          │          │        │
│ [Profesores] │       │          │          │          │          │        │
│ [Cursos]     │ 16:00 │┌────────┐│          │          │          │        │
│              │       ││Community││          │          │          │        │
│              │ 17:00 ││Manager ││          │          │          │        │
│ 🔍 Buscar:   │       ││J.García││          │          │          │        │
│ [_________]  │ 18:00 │└────────┘│          │          │          │        │
│              │       │          │          │          │          │        │
│ [Exportar]   │ 19:00 │          │          │          │          │        │
│ [Imprimir]   │       │          │          │          │          │        │
│              │ 20:00 │          │          │          │          │        │
│              │       │          │          │          │          │        │
│              │ 21:00 │          │          │          │          │        │
│              │       │          │          │          │          │        │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

#### Interacciones del Planner

**1. Drag and Drop**:
- Arrastrar bloques de curso entre aulas
- Arrastrar verticalmente para cambiar horario
- Validación en tiempo real al soltar
- Feedback visual: ✅ válido | ❌ conflicto

**2. Click en Bloque de Curso**:
```
┌──────────────────────────────────────┐
│  MARKETING DIGITAL AVANZADO          │
├──────────────────────────────────────┤
│  📍 CEP Norte - Aula A1              │
│  👨‍🏫 Prof. Juan García                │
│  📅 L-X-V: 09:00-11:00               │
│  👥 25/30 plazas ocupadas            │
│  📊 Estado: En curso                 │
│                                      │
│  [Ver Detalles Completos]            │
│  [Editar Horario]                    │
│  [Ver Conflictos]                    │
│  [Asignar Estudiantes]               │
└──────────────────────────────────────┘
```

**3. Detección Visual de Conflictos**:

```
🟥 Bloque Rojo = CONFLICTO CRÍTICO
┌──────────────────────────────────────┐
│  ⚠️ CONFLICTO DETECTADO              │
├──────────────────────────────────────┤
│  Tipo: Profesor en 2 sedes           │
│                                      │
│  Prof. Juan García:                  │
│  • CEP Norte: 09:00-11:00            │
│  • CEP Sur: 11:30-13:30              │
│                                      │
│  ❌ Solo 30 min de desplazamiento    │
│  ✅ Requiere mínimo 2 horas          │
│                                      │
│  💡 Sugerencias:                     │
│  • Cambiar CEP Sur a 13:00-15:00     │
│  • Asignar otro profesor a CEP Sur   │
│  • Cambiar aula en CEP Norte         │
│                                      │
│  [Aplicar Sugerencia 1]              │
│  [Resolver Manualmente]              │
└──────────────────────────────────────┘
```

**4. Vista Profesor** (cambio de perspectiva):

```
Vista: [Aulas] [→ Profesores ←] [Cursos]

┌──────────────────────────────────────────────────────────┐
│  PLANNER VISUAL - VISTA POR PROFESORES                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Profesor │ Lunes   │ Martes  │ Miércoles│ Jueves │...  │
├───────────┼─────────┼─────────┼──────────┼────────┼───  │
│ J.García  │09-11    │         │09-11     │16-18   │...  │
│           │Marketing│  LIBRE  │Marketing │SEO     │...  │
│           │CEP Norte│         │CEP Norte │CEP Sur │...  │
│           │         │         │          │⚠️      │...  │
│           │16-18    │         │16-18     │        │...  │
│           │Community│         │Community │        │...  │
│           │CEP Norte│         │CEP Norte │        │...  │
├───────────┼─────────┼─────────┼──────────┼────────┼───  │
│ M.López   │         │10-12    │          │10-12   │...  │
│           │  LIBRE  │SEO      │  LIBRE   │SEO     │...  │
│           │         │CEP Norte│          │CEP Norte    │
└───────────┴─────────┴─────────┴──────────┴────────┴───  ┘

⚠️ = Conflicto de desplazamiento detectado
```

---

## 3. ALGORITMO DE VALIDACIÓN DE CONFLICTOS

### 3.1 Reglas de Negocio

```typescript
interface ValidacionConvocatoria {
  conflictos: Conflicto[]
  esValida: boolean
  warnings: string[]
}

class ValidadorConvocatorias {

  /**
   * Valida que no haya superposición de aulas
   */
  validarDisponibilidadAula(
    aula: Aula,
    horarios: HorarioSemanal[],
    fechaInicio: Date,
    fechaFin: Date,
    excluirConvocatoria?: string
  ): Conflicto[] {
    const conflictos: Conflicto[] = []

    // Buscar convocatorias existentes en la misma aula
    const convocatoriasMismaAula = buscarConvocatoriasPorAula(aula.id)

    for (const existente of convocatoriasMismaAula) {
      if (existente.id === excluirConvocatoria) continue

      // Verificar superposición de fechas
      const haySuperposicionFechas = verificarSuperposicionFechas(
        fechaInicio, fechaFin,
        existente.fecha_inicio, existente.fecha_fin
      )

      if (haySuperposicionFechas) {
        // Verificar superposición de horarios semanales
        for (const nuevoHorario of horarios) {
          for (const horarioExistente of existente.horario_semanal) {
            if (nuevoHorario.dia === horarioExistente.dia) {
              const haySuperposicionHora = verificarSuperposicionHoraria(
                nuevoHorario.hora_inicio, nuevoHorario.hora_fin,
                horarioExistente.hora_inicio, horarioExistente.hora_fin
              )

              if (haySuperposicionHora) {
                conflictos.push({
                  tipo: 'aula_ocupada',
                  severidad: 'error',
                  mensaje: `Aula ${aula.nombre} ocupada ${nuevoHorario.dia} ${nuevoHorario.hora_inicio}-${nuevoHorario.hora_fin}`,
                  convocatoria_conflictiva: existente.id,
                  sugerencias: generarSugerenciasAula(aula, horarios)
                })
              }
            }
          }
        }
      }
    }

    return conflictos
  }

  /**
   * Valida disponibilidad del profesor
   */
  validarDisponibilidadProfesor(
    profesor: Profesor,
    sede: Sede,
    horarios: HorarioSemanal[],
    fechaInicio: Date,
    fechaFin: Date,
    excluirConvocatoria?: string
  ): Conflicto[] {
    const conflictos: Conflicto[] = []

    const convocatoriasProfesor = buscarConvocatoriasPorProfesor(profesor.id)

    for (const existente of convocatoriasProfesor) {
      if (existente.id === excluirConvocatoria) continue

      const haySuperposicionFechas = verificarSuperposicionFechas(
        fechaInicio, fechaFin,
        existente.fecha_inicio, existente.fecha_fin
      )

      if (haySuperposicionFechas) {
        for (const nuevoHorario of horarios) {
          for (const horarioExistente of existente.horario_semanal) {
            if (nuevoHorario.dia === horarioExistente.dia) {

              // REGLA 1: Superposición directa
              const haySuperposicionDirecta = verificarSuperposicionHoraria(
                nuevoHorario.hora_inicio, nuevoHorario.hora_fin,
                horarioExistente.hora_inicio, horarioExistente.hora_fin
              )

              if (haySuperposicionDirecta) {
                conflictos.push({
                  tipo: 'profesor_ocupado',
                  severidad: 'error',
                  mensaje: `Prof. ${profesor.nombre} ocupado ${nuevoHorario.dia} ${nuevoHorario.hora_inicio}-${nuevoHorario.hora_fin}`,
                  convocatoria_conflictiva: existente.id,
                  sugerencias: generarSugerenciasProfesor(profesor, horarios)
                })
              }

              // REGLA 2: Tiempo de desplazamiento entre sedes
              if (sede.id !== existente.sede.id) {
                const tiempoDesplazamiento = calcularTiempoEntreSedes(
                  nuevoHorario, horarioExistente
                )

                const TIEMPO_MINIMO_DESPLAZAMIENTO = 120 // 2 horas en minutos

                if (tiempoDesplazamiento < TIEMPO_MINIMO_DESPLAZAMIENTO) {
                  conflictos.push({
                    tipo: 'profesor_desplazamiento',
                    severidad: 'error',
                    mensaje: `Prof. ${profesor.nombre} necesita ${TIEMPO_MINIMO_DESPLAZAMIENTO}min entre sedes (actual: ${tiempoDesplazamiento}min)`,
                    convocatoria_conflictiva: existente.id,
                    sugerencias: [
                      `Mover clase nueva a ${calcularHorarioConMargen(horarioExistente, TIEMPO_MINIMO_DESPLAZAMIENTO)}`,
                      `Asignar otro profesor a esta convocatoria`,
                      `Cambiar sede de la convocatoria existente`
                    ]
                  })
                }
              }
            }
          }
        }
      }
    }

    return conflictos
  }

  /**
   * Valida capacidad del aula
   */
  validarCapacidadAula(
    aula: Aula,
    plazasTotales: number
  ): Conflicto[] {
    if (plazasTotales > aula.capacidad) {
      return [{
        tipo: 'capacidad_excedida',
        severidad: 'error',
        mensaje: `Plazas solicitadas (${plazasTotales}) exceden capacidad del aula (${aula.capacidad})`,
        sugerencias: [
          `Reducir plazas a ${aula.capacidad}`,
          `Seleccionar aula con mayor capacidad`,
          `Dividir el curso en 2 grupos`
        ]
      }]
    }
    return []
  }

  /**
   * Validación completa
   */
  validarConvocatoria(convocatoria: Partial<Convocatoria>): ValidacionConvocatoria {
    const conflictos: Conflicto[] = []

    // 1. Validar disponibilidad de aula
    if (convocatoria.aula && convocatoria.horario_semanal) {
      conflictos.push(...this.validarDisponibilidadAula(
        convocatoria.aula,
        convocatoria.horario_semanal,
        convocatoria.fecha_inicio!,
        convocatoria.fecha_fin!,
        convocatoria.id
      ))
    }

    // 2. Validar disponibilidad de profesor
    if (convocatoria.profesor_principal && convocatoria.horario_semanal) {
      conflictos.push(...this.validarDisponibilidadProfesor(
        convocatoria.profesor_principal,
        convocatoria.sede!,
        convocatoria.horario_semanal,
        convocatoria.fecha_inicio!,
        convocatoria.fecha_fin!,
        convocatoria.id
      ))
    }

    // 3. Validar capacidad
    if (convocatoria.aula && convocatoria.plazas_totales) {
      conflictos.push(...this.validarCapacidadAula(
        convocatoria.aula,
        convocatoria.plazas_totales
      ))
    }

    // 4. Warnings (no bloqueantes)
    const warnings: string[] = []

    // Warning: Curso muy largo sin descansos
    const horasSemanalesTotales = convocatoria.horario_semanal?.reduce(
      (sum, h) => sum + calcularDuracionMinutos(h.hora_inicio, h.hora_fin),
      0
    ) || 0

    if (horasSemanalesTotales > 360) { // Más de 6 horas seguidas
      warnings.push('⚠️ Curso supera 6h semanales. Considere añadir descansos.')
    }

    return {
      conflictos,
      esValida: conflictos.filter(c => c.severidad === 'error').length === 0,
      warnings
    }
  }
}

// Funciones auxiliares

function verificarSuperposicionFechas(
  inicio1: Date, fin1: Date,
  inicio2: Date, fin2: Date
): boolean {
  return inicio1 <= fin2 && fin1 >= inicio2
}

function verificarSuperposicionHoraria(
  inicio1: string, fin1: string,
  inicio2: string, fin2: string
): boolean {
  const [h1i, m1i] = inicio1.split(':').map(Number)
  const [h1f, m1f] = fin1.split(':').map(Number)
  const [h2i, m2i] = inicio2.split(':').map(Number)
  const [h2f, m2f] = fin2.split(':').map(Number)

  const min1i = h1i * 60 + m1i
  const min1f = h1f * 60 + m1f
  const min2i = h2i * 60 + m2i
  const min2f = h2f * 60 + m2f

  return min1i < min2f && min1f > min2i
}

function calcularTiempoEntreSedes(
  horario1: HorarioSemanal,
  horario2: HorarioSemanal
): number {
  // Calcula minutos entre fin de horario2 e inicio de horario1 (o viceversa)
  const [h1i, m1i] = horario1.hora_inicio.split(':').map(Number)
  const [h2f, m2f] = horario2.hora_fin.split(':').map(Number)

  const minInicioNueva = h1i * 60 + m1i
  const minFinExistente = h2f * 60 + m2f

  return Math.abs(minInicioNueva - minFinExistente)
}
```

---

## 4. CASOS DE USO PRINCIPALES

### Caso de Uso 1: Crear Nueva Convocatoria sin Conflictos

**Actor**: Administrador
**Flujo**:
1. Admin accede a `/programacion`
2. Click en "Nueva Convocatoria"
3. Selecciona curso: "Marketing Digital Avanzado"
4. Selecciona sede: "CEP Norte"
5. Selecciona aula: "Aula A1"
   - ✅ Sistema muestra disponibilidad en tiempo real
6. Selecciona profesor: "Juan García"
   - ✅ Sistema muestra agenda del profesor
7. Define horario: Lunes y Miércoles 09:00-11:00
8. Sistema ejecuta validación automática:
   - ✅ Aula disponible
   - ✅ Profesor disponible
   - ✅ Capacidad suficiente
9. Admin guarda convocatoria
10. Sistema muestra confirmación y actualiza el Planner Visual

**Resultado**: Convocatoria creada sin conflictos

---

### Caso de Uso 2: Resolver Conflicto de Profesor en 2 Sedes

**Actor**: Coordinador
**Situación**: Profesor tiene clase en CEP Norte 09:00-11:00 y CEP Sur 11:30-13:30 (solo 30 min de margen)

**Flujo**:
1. Coordinador accede a `/planner`
2. Sistema muestra bloque rojo (conflicto) en CEP Sur
3. Coordinador hace click en bloque rojo
4. Sistema muestra modal de conflicto con 3 sugerencias:
   - Sugerencia 1: Cambiar CEP Sur a 13:00-15:00 ✅
   - Sugerencia 2: Asignar otro profesor
   - Sugerencia 3: Cambiar aula en CEP Norte
5. Coordinador selecciona Sugerencia 1
6. Sistema valida nuevo horario:
   - ✅ Aula en CEP Sur disponible 13:00-15:00
   - ✅ Profesor ahora tiene 2h de margen
7. Sistema actualiza convocatoria automáticamente
8. Bloque cambia de 🟥 rojo a 🟦 azul (sin conflicto)

**Resultado**: Conflicto resuelto, horarios optimizados

---

### Caso de Uso 3: Visualización Multi-Sede con Filtros

**Actor**: Gestor (supervisa todas las sedes)
**Flujo**:
1. Gestor accede a `/planner`
2. Selecciona "Vista Profesor"
3. Aplica filtro: "Juan García"
4. Sistema muestra:
   - Todas las convocatorias de Juan García
   - En todas las sedes (CEP Norte, CEP Sur, CEP Santa Cruz)
   - Código de colores por sede
   - Conflictos de desplazamiento marcados en ⚠️
5. Gestor exporta a PDF para revisión
6. Imprime horario para entregar al profesor

**Resultado**: Visión completa del horario del profesor

---

### Caso de Uso 4: Reorganización mediante Drag & Drop

**Actor**: Coordinador
**Flujo**:
1. Coordinador accede a `/planner`
2. Vista: Aulas de CEP Norte
3. Identifica que Aula A1 está sobrecargada
4. Arrastra curso "SEO" de Aula A1 a Aula B1
5. Durante el arrastre, sistema muestra:
   - 🟩 Verde si el destino es válido
   - 🟥 Rojo si hay conflicto
6. Al soltar en Aula B1:
   - Sistema valida disponibilidad
   - ✅ Aula B1 disponible en ese horario
   - ✅ Capacidad suficiente
7. Sistema actualiza convocatoria automáticamente
8. Bloque aparece en Aula B1

**Resultado**: Redistribución de aulas sin conflictos

---

## 5. MODELO DE DATOS COMPLETO

### Relaciones entre Entidades

```
Convocatoria
├── curso_id → Curso
├── sede_id → Sede
├── aula_id → Aula
│   └── sede_id → Sede (consistencia)
├── profesor_principal_id → Profesor
├── profesores_secundarios_ids[] → Profesor[]
└── estudiantes_matriculados_ids[] → Estudiante[] (via Enrollments)

Aula
├── sede_id → Sede
└── Unique(sede_id, codigo)

Convocatoria + HorarioSemanal
├── Unique(aula_id, dia, hora_inicio, hora_fin, fecha_overlap)
└── Check: hora_fin > hora_inicio
```

### Índices de Base de Datos (PostgreSQL)

```sql
-- Índices para búsquedas rápidas en Planner
CREATE INDEX idx_convocatorias_sede_fechas
  ON convocatorias (sede_id, fecha_inicio, fecha_fin);

CREATE INDEX idx_convocatorias_aula_fechas
  ON convocatorias (aula_id, fecha_inicio, fecha_fin);

CREATE INDEX idx_convocatorias_profesor_fechas
  ON convocatorias (profesor_principal_id, fecha_inicio, fecha_fin);

-- Índice compuesto para validación de disponibilidad
CREATE INDEX idx_horario_semanal_validacion
  ON horarios_semanales (convocatoria_id, dia, hora_inicio, hora_fin);

-- Índice para búsqueda de conflictos
CREATE INDEX idx_convocatorias_estado_sede
  ON convocatorias (estado, sede_id)
  WHERE estado IN ('planificada', 'abierta', 'en_curso');
```

---

## 6. FASES DE IMPLEMENTACIÓN

### FASE 1: Infraestructura y Modelos (Semana 1-2)
**Objetivo**: Base de datos y API funcional

**Tareas**:
1. Crear modelo `Aula` en Payload CMS
   - Colección con campos: nombre, codigo, sede, capacidad, tipo, equipamiento
   - Validaciones: capacidad > 0, codigo único por sede
   - Access Control: Solo Admin/Gestor pueden crear/editar

2. Crear modelo `Convocatoria` en Payload CMS
   - Colección con 20+ campos
   - Relaciones: curso, sede, aula, profesor
   - Hook `beforeValidate`: Ejecutar `ValidadorConvocatorias`
   - Hook `beforeChange`: Detectar conflictos y bloquear si `severidad === 'error'`

3. Crear tabla `horarios_semanales` (relación one-to-many con Convocatoria)

4. Implementar clase `ValidadorConvocatorias` con todos los métodos de validación

5. Crear endpoints API personalizados:
   - `POST /api/convocatorias/validar` - Validación sin guardar
   - `GET /api/planner/disponibilidad-aula/:aulaId` - Disponibilidad de aula
   - `GET /api/planner/agenda-profesor/:profesorId` - Agenda de profesor
   - `GET /api/planner/conflictos` - Todos los conflictos activos

**Entregables**:
- ✅ Base de datos con índices optimizados
- ✅ API REST funcional con validaciones
- ✅ Tests unitarios de ValidadorConvocatorias (>80% coverage)

---

### FASE 2: Sección Programación (Semana 3-4)
**Objetivo**: Formulario de creación/edición de convocatorias

**Tareas**:
1. Crear página `/programacion`
   - Lista de convocatorias con filtros
   - Resumen de estadísticas
   - Indicadores visuales de conflictos

2. Crear formulario de Nueva Convocatoria (4 pasos):
   - Paso 1: Selección de curso
   - Paso 2: Recursos (sede, aula, profesor)
   - Paso 3: Horario semanal (componente de repetición)
   - Paso 4: Capacidad y estado

3. Implementar validación en tiempo real:
   - Al seleccionar aula → mostrar disponibilidad
   - Al seleccionar profesor → mostrar agenda
   - Al definir horario → validar automáticamente

4. Componente `DisponibilidadAula`:
   - Calendario mini mostrando ocupación del aula
   - Código de colores: 🟩 Libre | 🟥 Ocupada

5. Componente `AgendaProfesor`:
   - Lista de convocatorias actuales del profesor
   - Alerta visual si hay conflictos potenciales

6. Modal de resolución de conflictos:
   - Mostrar conflictos detectados
   - Sugerencias automáticas
   - Botones de acción rápida

**Entregables**:
- ✅ CRUD completo de Convocatorias
- ✅ Validación en tiempo real
- ✅ UX intuitiva con feedback visual
- ✅ Tests E2E del flujo completo

---

### FASE 3: Planner Visual - Vista Básica (Semana 5-6)
**Objetivo**: Calendario visual estático (solo lectura)

**Tareas**:
1. Crear página `/planner`
   - Layout de 3 paneles (leyenda | calendario | detalles)

2. Componente `CalendarioSemanal`:
   - Grid de horas (8:00-22:00) x aulas
   - Renderizado de bloques de curso
   - Colores según estado: 🟦 Activo | 🟨 Planificado | 🟥 Conflicto

3. Lógica de posicionamiento de bloques:
   - Calcular altura en función de duración
   - Calcular posición Y en función de hora de inicio
   - Detectar superposiciones visuales

4. Componente `BloqueCurso`:
   - Card con información básica
   - Tooltip con detalles completos
   - Click → abrir modal de detalles

5. Filtros de visualización:
   - Por sede (dropdown)
   - Por aula (multi-select)
   - Por profesor (multi-select)
   - Por curso (search)

6. Navegación temporal:
   - Selector de semana (anterior/siguiente)
   - Vista semanal vs mensual
   - Jump to date

**Entregables**:
- ✅ Visualización completa de horarios
- ✅ Detección visual de conflictos
- ✅ Filtros funcionales
- ✅ Responsive design (min 1280px de ancho)

---

### FASE 4: Planner Visual - Interactividad (Semana 7-8)
**Objetivo**: Drag & Drop y edición en vivo

**Tareas**:
1. Implementar Drag & Drop con `dnd-kit`:
   - Draggable: BloqueCurso
   - Droppable: Slots de aula
   - Feedback visual durante arrastre

2. Validación en tiempo real durante drag:
   - Al pasar sobre slot → validar disponibilidad
   - Mostrar 🟩 verde si válido, 🟥 rojo si conflicto
   - Mostrar mensaje de error si no se puede soltar

3. Actualización optimista:
   - Al soltar bloque → actualizar UI inmediatamente
   - Enviar request a API en background
   - Revertir si API rechaza (rollback)

4. Vista de 3 perspectivas:
   - Vista Aulas (default)
   - Vista Profesores (cambio de layout)
   - Vista Cursos (agrupación diferente)

5. Exportación e impresión:
   - Exportar a PDF (vista actual)
   - Exportar a Excel (datos tabulares)
   - Imprimir horario optimizado para papel

6. Sincronización en tiempo real (opcional):
   - WebSockets para actualizaciones multi-usuario
   - Notificación cuando otro usuario modifica algo

**Entregables**:
- ✅ Drag & Drop funcional con validaciones
- ✅ 3 vistas diferentes
- ✅ Exportación/impresión
- ✅ UX fluida y responsiva

---

### FASE 5: Optimizaciones y Producción (Semana 9-10)
**Objetivo**: Performance, testing y deploy

**Tareas**:
1. Optimización de rendimiento:
   - Virtualización de calendario (solo renderizar slots visibles)
   - Memoización de cálculos pesados
   - Lazy loading de datos
   - Cache de consultas frecuentes (Redis)

2. Testing comprehensivo:
   - Unit tests: ValidadorConvocatorias (100%)
   - Integration tests: API endpoints
   - E2E tests: Flujos completos de usuario
   - Load testing: 100+ convocatorias simultáneas

3. Documentación:
   - Manual de usuario para Admins
   - Guía de resolución de conflictos
   - API documentation (OpenAPI/Swagger)

4. Deploy y monitoreo:
   - Deploy a staging
   - QA completo
   - Deploy a producción
   - Configurar alertas de errores

5. Capacitación:
   - Sesión de formación para Admins
   - Videos tutoriales
   - FAQ y troubleshooting

**Entregables**:
- ✅ Sistema en producción
- ✅ Documentación completa
- ✅ Tests passing al 100%
- ✅ Performance optimizado

---

## 7. STACK TECNOLÓGICO RECOMENDADO

### Frontend
- **React 19** con TypeScript
- **Next.js 15** (App Router)
- **TailwindCSS 4** para estilos
- **shadcn/ui** para componentes base
- **dnd-kit** para Drag & Drop
- **date-fns** para manipulación de fechas
- **Recharts** para gráficos de ocupación (opcional)

### Backend
- **Payload CMS 3** para colecciones y API
- **PostgreSQL 16** con índices optimizados
- **Redis** para cache de validaciones frecuentes
- **BullMQ** para procesamiento asíncrono (envío de notificaciones)

### Testing
- **Vitest** para unit tests
- **Testing Library** para component tests
- **Playwright** para E2E tests

---

## 8. CRITERIOS DE ACEPTACIÓN

### Programación
✅ Crear convocatoria con validación automática
✅ Detectar conflictos de aula en tiempo real
✅ Detectar conflictos de profesor en tiempo real
✅ Validar tiempo de desplazamiento entre sedes (2h mínimo)
✅ Mostrar sugerencias de resolución de conflictos
✅ Editar convocatoria existente sin romper validaciones
✅ Ver disponibilidad de aula antes de asignar
✅ Ver agenda de profesor antes de asignar

### Planner Visual
✅ Visualizar horarios de todas las aulas de una sede
✅ Cambiar vista: Aulas / Profesores / Cursos
✅ Filtrar por sede, aula, profesor, curso
✅ Navegar entre semanas (anterior/siguiente)
✅ Ver detalles de convocatoria al hacer click
✅ Detectar visualmente conflictos (bloques rojos)
✅ Arrastrar y soltar cursos entre aulas (drag & drop)
✅ Validar en tiempo real al arrastrar
✅ Exportar a PDF/Excel
✅ Imprimir horario optimizado

### Performance
✅ Carga inicial < 2 segundos
✅ Validación de conflictos < 500ms
✅ Drag & drop sin lag perceptible
✅ Soportar 200+ convocatorias sin degradación

### Seguridad
✅ Solo Admin/Gestor pueden crear/editar convocatorias
✅ Profesores solo ven su agenda (read-only)
✅ Audit log de todas las modificaciones
✅ Validación server-side (no confiar en cliente)

---

## 9. EJEMPLO DE DATOS DE PRUEBA

### Escenario de Prueba 1: Semana Típica CEP Norte

```javascript
const convocatoriasPrueba = [
  {
    curso: 'Marketing Digital Avanzado',
    sede: 'CEP Norte',
    aula: 'Aula A1',
    profesor: 'Juan García',
    horario: [
      { dia: 'lunes', hora_inicio: '09:00', hora_fin: '11:00' },
      { dia: 'miércoles', hora_inicio: '09:00', hora_fin: '11:00' },
      { dia: 'viernes', hora_inicio: '09:00', hora_fin: '11:00' }
    ],
    plazas: 25,
    fecha_inicio: '2025-01-15',
    fecha_fin: '2025-03-30'
  },
  {
    curso: 'SEO y Posicionamiento Web',
    sede: 'CEP Norte',
    aula: 'Lab Informática 1',
    profesor: 'María López',
    horario: [
      { dia: 'martes', hora_inicio: '10:00', hora_fin: '12:00' },
      { dia: 'jueves', hora_inicio: '10:00', hora_fin: '12:00' }
    ],
    plazas: 20,
    fecha_inicio: '2025-01-15',
    fecha_fin: '2025-03-30'
  },
  {
    curso: 'Desarrollo de Aplicaciones Web',
    sede: 'CEP Norte',
    aula: 'Lab Informática 2',
    profesor: 'Ana Ruiz',
    horario: [
      { dia: 'lunes', hora_inicio: '12:00', hora_fin: '14:00' },
      { dia: 'martes', hora_inicio: '12:00', hora_fin: '14:00' },
      { dia: 'miércoles', hora_inicio: '12:00', hora_fin: '14:00' }
    ],
    plazas: 18,
    fecha_inicio: '2025-01-15',
    fecha_fin: '2025-05-30'
  },
  {
    curso: 'Community Manager Profesional',
    sede: 'CEP Norte',
    aula: 'Aula A1', // MISMO AULA que Marketing Digital
    profesor: 'Juan García', // MISMO PROFESOR
    horario: [
      { dia: 'lunes', hora_inicio: '16:00', hora_fin: '18:00' }, // ✅ OK (diferente hora)
      { dia: 'miércoles', hora_inicio: '16:00', hora_fin: '18:00' }, // ✅ OK
      { dia: 'viernes', hora_inicio: '16:00', hora_fin: '18:00' } // ✅ OK
    ],
    plazas: 22,
    fecha_inicio: '2025-02-01',
    fecha_fin: '2025-04-15'
  }
]
```

### Escenario de Prueba 2: Conflicto de Desplazamiento

```javascript
const conflictoDesplazamiento = {
  // Convocatoria 1: CEP Norte
  convocatoria1: {
    curso: 'Marketing Digital',
    sede: 'CEP Norte',
    profesor: 'Juan García',
    horario: [
      { dia: 'lunes', hora_inicio: '09:00', hora_fin: '11:00' }
    ]
  },
  // Convocatoria 2: CEP Sur (30km de distancia)
  convocatoria2: {
    curso: 'SEO Avanzado',
    sede: 'CEP Sur',
    profesor: 'Juan García', // MISMO PROFESOR
    horario: [
      { dia: 'lunes', hora_inicio: '11:30', hora_fin: '13:30' } // ❌ Solo 30min de margen
    ]
  }
}

// Resultado esperado:
{
  esValida: false,
  conflictos: [
    {
      tipo: 'profesor_desplazamiento',
      severidad: 'error',
      mensaje: 'Prof. Juan García necesita 120min entre sedes (actual: 30min)',
      sugerencias: [
        'Mover CEP Sur a 13:00-15:00',
        'Asignar otro profesor a CEP Sur',
        'Cambiar sede de alguna convocatoria'
      ]
    }
  ]
}
```

---

## 10. NOTAS FINALES

### Consideraciones de UX
1. **Feedback visual inmediato**: Usuario debe saber en todo momento si una acción es válida
2. **Tooltips contextuales**: Explicar por qué algo es un conflicto
3. **Sugerencias proactivas**: No solo decir "error", sino ofrecer soluciones
4. **Undo/Redo**: Permitir deshacer cambios en el Planner Visual
5. **Mobile**: Programación responsive, pero Planner requiere pantalla grande (min 1280px)

### Escalabilidad
- Sistema debe soportar **5 sedes** simultáneas
- Hasta **50 aulas** por sede
- Hasta **100 profesores** activos
- Hasta **500 convocatorias** activas por año académico

### Integración Futura
- Sincronización con Google Calendar (profesores)
- Notificaciones por email de cambios de horario
- Reserva de equipamiento especial (proyectores, ordenadores)
- Gestión de ausencias de profesores (sustitutos automáticos)

---

## PROMPT FINAL PARA EL AGENTE

**CONTEXTO**: Eres un desarrollador senior especializado en sistemas de gestión académica. Vas a implementar dos secciones críticas para CEP FORMACIÓN: **Programación** (gestión de convocatorias) y **Planner Visual** (calendario interactivo de horarios).

**OBJETIVO**: Desarrollar un sistema que permita planificar horarios académicos sin conflictos, asignando cursos a aulas y profesores de forma óptima, con detección automática de superposiciones y restricciones de desplazamiento entre sedes.

**RESTRICCIONES CRÍTICAS**:
1. Aula única: No pueden coincidir 2 cursos en la misma aula al mismo tiempo
2. Profesor único: Un profesor no puede estar en 2 lugares simultáneamente
3. Desplazamiento entre sedes: Mínimo 2 horas de margen si el profesor debe cambiar de sede
4. Capacidad del aula: No exceder la capacidad máxima
5. Validación server-side: Nunca confiar en el cliente

**METODOLOGÍA**:
- Desarrollo iterativo por fases (10 semanas)
- TDD: Tests primero, luego implementación
- Validación automática en cada cambio
- Feedback visual en tiempo real

**PRIORIDAD**:
1. **FASE 1**: Modelos y validaciones (crítico)
2. **FASE 2**: Formulario de Programación
3. **FASE 3**: Planner Visual estático
4. **FASE 4**: Drag & Drop interactivo
5. **FASE 5**: Optimización y producción

**TECH STACK**:
- Frontend: Next.js 15 + React 19 + TailwindCSS 4 + shadcn/ui + dnd-kit
- Backend: Payload CMS 3 + PostgreSQL 16 + Redis
- Testing: Vitest + Testing Library + Playwright

**CRITERIOS DE ÉXITO**:
- ✅ Cero conflictos no detectados
- ✅ Validación en < 500ms
- ✅ UX intuitiva (arrastrar y soltar)
- ✅ Tests passing al 100%
- ✅ Documentación completa

**COMIENZA** implementando la **FASE 1** (modelos y validaciones). Pregunta cualquier duda antes de empezar.
