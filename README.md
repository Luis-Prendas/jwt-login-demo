# 🏢 Sistema de Gestión Organizacional

Este proyecto implementa una base de datos y estructura backend para gestionar **organizaciones, departamentos, puestos, usuarios y su relación jerárquica**, incluyendo control de horarios y asistencias.

---

## 📌 Objetivo

El sistema busca centralizar la información organizacional de forma escalable y modular, permitiendo:

- Registrar múltiples organizaciones.
- Definir departamentos y puestos de trabajo.
- Asignar usuarios a organizaciones y puestos.
- Controlar roles, accesos y jerarquías.
- Administrar horarios y asistencias.

---

## 🏗️ Arquitectura de Datos

La estructura sigue un modelo jerárquico y dependiente:

1. **Organizaciones (`Organization`)**  
   Nodo raíz. Toda la estructura depende de la organización.  

2. **Departamentos (`Department`)**  
   Pertenecen a una organización. Agrupan puestos de trabajo.  

3. **Puestos (`Position`)**  
   Definidos dentro de un departamento. Representan el rol laboral.  

4. **Usuarios (`User`)**  
   Se asignan a una organización y pueden ocupar uno o más puestos.  

5. **Relación Usuario ↔ Puesto (`UserPosition`)**  
   Define qué usuario ocupa qué puesto.  

6. **Horarios (`Schedule`)**  
   Indican la planificación laboral de los usuarios.  

7. **Asistencias (`Attendance`)**  
   Registra entradas, salidas y estado de asistencia de los usuarios.  

---

## 🛠️ Tecnologías

- **Node.js** (Runtime)
- **TypeScript** (Tipado estático)
- **Prisma ORM** (Manejo de base de datos)
- **Zod** (Validación de datos)
- **SQLite** (Entorno local, puede migrarse a PostgreSQL)
- **JWT** (Sistema de autenticación)
- **React + Vite** (Frontend)
- **Shadcn/UI** (Librería de componentes)

---

## 📦 Prerrequisitos

- Node.js **>= 20.x**
- npm **>= 10.x**

---

## 🚀 Instalación y Uso

### 1. Clonar repositorio
```bash
git clone https://github.com/Luis-Prendas/sigeor-workspace.git
cd sigeor-workspace
````

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd ./backend
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en cada carpeta, siguiendo el ejemplo de `.env.example`.

**Frontend**

```env
VITE_API_URL=""
VITE_SOCKET_URL=""
VITE_SITE_URL=""
```

**Backend**

```env
SECRET_KEY=""
PORT=""
DATABASE_URL=""
```

### 5. Ejecutar migraciones y cargar datos iniciales

> ⚠️ Este paso borra y recrea toda la información en la base de datos.

```bash
cd ./backend
npm run reset:prisma
```

### 6. Iniciar los servidores

**Frontend**

```bash
npm run dev
```

**Backend**

```bash
cd ./backend
npm run dev
```

---

## 📜 Scripts disponibles

### Frontend

* `npm run dev` → Inicia la app en modo desarrollo.
* `npm run build` → Compila el proyecto.

### Backend

* `npm run dev` → Inicia el servidor en modo desarrollo.
* `npm run reset:prisma` → Resetea la base de datos (migraciones + seed).

---

## 📄 Licencia

MIT © 2025
