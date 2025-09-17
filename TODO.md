# **Sistema de Gestión Organizacional — Documento General**

## **1️⃣ Organizaciones**

### **Descripción para no desarrolladores**

El módulo de organizaciones representa las compañías o entidades que gestionará el sistema. Es la raíz de toda la estructura y permite agrupar departamentos, puestos y usuarios.
Cada organización puede tener nombre, logo, slogan y descripción corporativa. Este módulo también permite realizar eliminaciones suaves (soft delete) y registrar quién hizo los cambios.

### **Funcionalidades principales**

* Crear, editar y eliminar organizaciones.
* Visualizar lista de organizaciones con información básica.
* Información corporativa: logo, slogan, descripción.
* Auditoría de cambios.

### **Pantallas recomendadas**

1. Lista de organizaciones.
2. Formulario de creación/edición.
3. Detalle de organización con lista de departamentos asociados.

---

## **2️⃣ Departamentos**

### **Descripción para no desarrolladores**

Los departamentos son divisiones dentro de cada organización. Permiten segmentar la estructura de la compañía y asociar puestos y usuarios de manera ordenada.

### **Funcionalidades principales**

* CRUD de departamentos.
* Visualización jerárquica por organización.
* Auditoría y soft delete.

### **Pantallas recomendadas**

1. Lista de departamentos por organización.
2. Formulario de creación/edición.
3. Detalle con lista de puestos y usuarios asignados.

---

## **3️⃣ Puestos (Positions)**

### **Descripción para no desarrolladores**

Los puestos definen roles internos dentro de un departamento. Permiten asignar usuarios y diferenciar género si es necesario (maleName/femaleName).

### **Funcionalidades principales**

* CRUD de puestos por departamento.
* Asignación de usuarios a puestos.
* Diferenciación de nombres por género.

### **Pantallas recomendadas**

1. Lista de puestos por departamento.
2. Formulario de creación/edición.
3. Vista de detalle con usuarios asignados.

---

## **4️⃣ Usuarios**

### **Descripción para no desarrolladores**

Los usuarios representan a las personas que interactúan con el sistema. Para existir, deben pertenecer a una organización y opcionalmente estar asignados a un puesto. Incluye información de contacto, credenciales y rol dentro del sistema.

### **Funcionalidades principales**

* Crear, editar y eliminar usuarios (soft delete).
* Asignación a organización y puesto.
* Gestión de roles y permisos: `SUPERADMIN`, `ADMIN`, `DEVELOPER`, `MANAGER`, `MODERATOR`, `EMPLOYEE`, `USER`.
* Visualización de perfil y auditoría.

### **Pantallas recomendadas**

1. Lista de usuarios con filtros (por organización, departamento o rol).
2. Formulario de usuario (crear/editar).
3. Detalle de usuario con historial de cambios.

---

## **5️⃣ Asignaciones de Puestos (UserPosition)**

### **Descripción para no desarrolladores**

Este módulo registra qué usuario ocupa qué puesto. Permite saber quién está asignado a qué rol dentro de un departamento y organización.

### **Funcionalidades principales**

* CRUD de asignaciones.
* Validación para evitar duplicados (un usuario no puede tener el mismo puesto varias veces).

### **Pantallas recomendadas**

1. Lista de asignaciones por departamento o usuario.
2. Formulario de asignación.

---

## **6️⃣ Horarios Laborales (Schedules)**

### **Descripción para no desarrolladores**

Permite definir horarios para los usuarios o plantillas de horarios por organización. Cada horario incluye día de la semana, hora de inicio y fin, y descripción.

### **Funcionalidades principales**

* CRUD de horarios.
* Asignación de horarios a usuarios o a la organización.
* Visualización tipo calendario.

---

## **7️⃣ Asistencia (Attendance)**

### **Descripción para no desarrolladores**

Permite registrar la entrada y salida de los usuarios, asociada a un horario. También se puede determinar el estado: puntual, tarde, ausente o excusado.

### **Funcionalidades principales**

* Registrar clockIn y clockOut.
* Asociar asistencia a horario.
* Historial por usuario, departamento u organización.
* Visualización de reportes de puntualidad y productividad.

---

## **8️⃣ Auditoría y Metadatos**

### **Descripción para no desarrolladores**

Permite registrar todo cambio de estado dentro del sistema: creación, modificación o eliminación de registros. Esto aplica a todos los módulos anteriores y asegura trazabilidad.

---

## **9️⃣ Dashboard / Reportes**

### **Descripción para no desarrolladores**

Ofrece una visión global del sistema para los administradores:

* Usuarios activos por organización.
* Resumen de asistencia.
* Cantidad de puestos y departamentos.
* Alertas de ausencias o tardanzas.
* Accesos rápidos a módulos clave.

---

# **Sistema de Gestión Organizacional — Documento Técnico**

## **1️⃣ Organizaciones (Organization)**

### **Propósito técnico**

La organización es el **nodo raíz** de todo el sistema. Todos los módulos dependen indirectamente de ella. Su correcto diseño y persistencia es crítico.

### **Implementación**

* Modelo Prisma: `Organization`.
* Campos: `id (PK)`, `corporateName`, `displayName`, `organizationCode (unique)`, `logoUrl`, `slogan`, `description`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `createdBy`, `updatedBy`, `deletedBy`.
* Relaciones: `departments`, `users`, `schedules` (plantillas globales).
* Auditoría: usar `createdAt/updatedAt` y `soft delete`.
* Consideraciones: índices sobre `organizationCode` y `isDeleted` para optimizar consultas de filtrado.

### **Tareas de desarrollo**

1. CRUD completo con soft delete y auditoría.
2. Validaciones de unicidad (`organizationCode`).
3. Interfaces para listado, formulario y detalle jerárquico.
4. Seed inicial de datos de prueba para desarrollo.

---

## **2️⃣ Departamentos (Department)**

### **Propósito técnico**

Define divisiones dentro de cada organización. Sirve de contenedor para puestos y usuarios.

### **Implementación**

* Modelo Prisma: `Department`.
* Campos: `id (PK)`, `organizationId (FK)`, `name`, `description`, auditoría.
* Relaciones: `organization` (parent), `positions` (child).
* Índices: `[organizationId]`, `[isDeleted]` para filtrado rápido.

### **Tareas de desarrollo**

1. CRUD con validación de existencia de `organizationId`.
2. Interfaces para listado por organización, creación/edición.
3. Integración con módulo de puestos (`Position`) para vista jerárquica.
4. Soft delete propagable opcional (marcar puestos asociados como borrados lógicamente).

---

## **3️⃣ Puestos (Position)**

### **Propósito técnico**

Define roles internos dentro de un departamento, incluyendo nombres por género si aplica. Permite vincular usuarios.

### **Implementación**

* Modelo Prisma: `Position`.
* Campos: `id (PK)`, `departmentId (FK)`, `maleName`, `femaleName`, `description`, auditoría.
* Relaciones: `department`, `userPositions`.
* Índices: `[departmentId]` para filtros y relaciones.

### **Tareas de desarrollo**

1. CRUD con validación de `departmentId`.
2. Gestión de nombres por género para interfaz.
3. Interfaces de listado y detalle, mostrando usuarios asignados mediante `UserPosition`.
4. Historial de cambios y soft delete.

---

## **4️⃣ Usuarios (User)**

### **Propósito técnico**

Usuarios del sistema con credenciales, información personal, rol y asignación a organización/puestos. Dependientes de organización y eventualmente puestos.

### **Implementación**

* Modelo Prisma: `User`.
* Campos: `id`, `email`, `username (unique)`, `password (hashed)`, `nickname`, `name`, `lastName`, `phone`, `gender`, `birthDate`, `identificationNumber`, `address`, `role`, `organizationId`, `description`, auditoría y `isDeleted`.
* Relaciones: `organization`, `userPositions`, `schedules`, `attendance`.
* Consideraciones: hash de contraseña, validación de email/username únicos, soft delete y auditoría.

### **Tareas de desarrollo**

1. CRUD de usuarios con validación de `organizationId`.
2. Hashing de contraseñas y gestión de login.
3. Gestión de roles y permisos para control de acceso a endpoints.
4. Interfaces de listado, detalle y edición de perfil.
5. Integración con `UserPosition` para asignación a puestos.
6. Auditoría completa de cambios.

---

## **5️⃣ Asignaciones de Puestos (UserPosition)**

### **Propósito técnico**

Representa la relación entre un usuario y un puesto específico. Evita duplicados y permite mostrar la estructura de la organización.

### **Implementación**

* Modelo Prisma: `UserPosition`.
* Campos: `id`, `userId (FK)`, `positionId (FK)`, auditoría y soft delete.
* Restricciones: `@@unique([userId, positionId])`.
* Relaciones: `user`, `position`.
* Índices: `[userId]`, `[positionId]` para consultas rápidas.

### **Tareas de desarrollo**

1. CRUD con validación de existencia de `userId` y `positionId`.
2. Interfaces de asignación y visualización jerárquica.
3. Auditoría y soft delete implementados.
4. Integración con módulos de horarios y reportes.

---

## **6️⃣ Horarios Laborales (Schedule)**

### **Propósito técnico**

Define horarios de trabajo, tanto por usuario como plantillas globales de organización.

### **Implementación**

* Modelo Prisma: `Schedule`.
* Campos: `id`, `userId?`, `organizationId?`, `dayOfWeek`, `startTime ("HH:mm")`, `endTime ("HH:mm")`, `description`, auditoría, soft delete.
* Relaciones: opcionales `user` y `organization`, `attendance`.
* Índices: `[userId]`, `[organizationId]`, `[dayOfWeek]`.

### **Tareas de desarrollo**

1. CRUD con validación de `userId` o `organizationId`.
2. Interfaz de calendario para gestión de horarios.
3. Plantillas globales reutilizables por organización.
4. Integración con asistencia (`Attendance`) para calcular cumplimiento.

---

## **7️⃣ Asistencia (Attendance)**

### **Propósito técnico**

Registra la entrada/salida de usuarios, vinculada a un horario específico. Estado controlado mediante enum `AttendanceStatus`.

### **Implementación**

* Modelo Prisma: `Attendance`.
* Campos: `id`, `userId (FK)`, `scheduleId (FK)`, `dayOfWeek`, `date`, `clockIn`, `clockOut`, `status (enum)`, auditoría, soft delete.
* Relaciones: `user`, `schedule`.
* Índices: `[userId]`, `[scheduleId]`, `[date]`.

### **Tareas de desarrollo**

1. CRUD de asistencia manual o automático.
2. Cálculo de estado según horario (`ON_TIME`, `LATE`, `ABSENT`).
3. Visualización y filtrado por usuario, departamento o organización.
4. Integración con dashboard y reportes.

---

## **8️⃣ Auditoría y Metadatos**

### **Propósito técnico**

Registro de cambios transversales para todas las entidades críticas.

### **Implementación**

* Auditoría en cada modelo: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `deletedAt`, `deletedBy`, `isDeleted`.
* Posible tabla agregada de logs globales si se requiere rastreo unificado.
* Aplicar soft delete y filtros por `isDeleted`.

---

## **9️⃣ Dashboard y Reportes**

### **Propósito técnico**

Visualización de indicadores clave para administradores y supervisores.

### **Implementación**

* Agregaciones sobre `User`, `UserPosition`, `Schedule`, `Attendance`.
* KPIs: asistencia por semana, usuarios activos, tardanzas, puestos y departamentos.
* Generación de reportes PDF/Excel opcional.
* Integración con notificaciones (email o Slack) si se implementa.

---

# **Notas técnicas generales**

1. **Orden de desarrollo recomendado:**
   `Organization → Department → Position → User → UserPosition → Schedule → Attendance → Auditoría → Dashboard`.
2. **Soft delete y auditoría** son transversales.
3. **Enums controlados** (`UserRole`, `AttendanceStatus`) para seguridad y consistencia.
4. **Índices y unicidades** clave para rendimiento en consultas jerárquicas y filtros.
5. **Formato de horarios**: `"HH:mm"` para recurrentes, `DateTime` para instancias concretas.
6. **Migraciones**: cuidado al renombrar columnas (`identificationNumber`) y expandir enums.

---

## 🛣️ Roadmap

### ✅ MVP (ya implementado / en curso)
- [x] Modelo de datos con Prisma (Organizaciones, Departamentos, Puestos, Usuarios, Horarios, Asistencias).
- [x] Autenticación con JWT.
- [x] Validación de datos con Zod.
- [x] Soft delete con campos de auditoría (`isDeleted`, `createdBy`, `updatedBy`, etc.).
- [x] Frontend inicial con React + Vite.
- [x] Configuración de migraciones y seed automáticas.

### 🔜 Próximos pasos
- [ ] **Dashboard general** con métricas (usuarios activos, asistencias de la semana, puestos por departamento).
- [ ] **Roles y permisos avanzados** (control granular de accesos por módulo/acción).
- [ ] **Reportes** exportables (CSV, Excel, PDF).
- [ ] **Visualización jerárquica** de la organización (estructura tipo árbol).
- [ ] **Gestión de horarios avanzados** (feriados, excepciones, reglas recurrentes).
- [ ] **Notificaciones** (correo o integración con Slack/Teams).
- [ ] **Internacionalización (i18n)** para soporte multi-idioma.
- [ ] **Integración biométrica/RFID** para asistencia (opcional).

### 🚀 Futuro
- [ ] Soporte para múltiples bases de datos (PostgreSQL, MySQL).
- [ ] Sistema multi-tenant avanzado (aislar datos entre organizaciones).
- [ ] API pública con tokens de acceso por cliente.
- [ ] Integraciones externas (ERP/HR, proveedores de nómina).

---