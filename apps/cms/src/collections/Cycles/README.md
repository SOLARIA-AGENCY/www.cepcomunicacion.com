# Cycles Collection

Educational cycle types for Spanish vocational training (Formación Profesional).

## Schema

- `slug` (string, unique): URL-friendly identifier
- `name` (string): Display name
- `level` (enum): One of 'fp_basica', 'grado_medio', 'grado_superior'
- `description` (text): Full description

## Access Control

- **Create**: Admin, Gestor
- **Read**: All authenticated users
- **Update**: Admin, Gestor
- **Delete**: Admin only

## TDD Implementation Status

- [ ] Tests written
- [ ] Collection config implemented
- [ ] Access control tested
- [ ] Validation tested
