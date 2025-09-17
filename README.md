# 🏢 SIGEOR - Sistema de Gestión Organizacional

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express)](https://expressjs.com/)

Sistema integral de gestión organizacional desarrollado con arquitectura full-stack moderna, diseñado para centralizar la administración de organizaciones, departamentos, usuarios y control de asistencias con escalabilidad empresarial.

---

## 📋 Descripción del Proyecto

SIGEOR es una plataforma web que implementa un sistema completo de gestión organizacional con las siguientes capacidades:

- **Gestión Multiorganizacional**: Soporte para múltiples organizaciones independientes
- **Estructura Jerárquica**: Departamentos, posiciones y roles organizacionales
- **Control de Acceso**: Sistema de autenticación JWT con roles diferenciados
- **Gestión de Usuarios**: CRUD completo con asignación de posiciones
- **Control de Asistencias**: Registro y seguimiento de horarios laborales
- **Interface Moderna**: UI responsiva con soporte para temas claro/oscuro

---

## 🏗️ Arquitectura del Sistema

### **Backend Architecture**
```
backend/
├── src/
│   ├── controllers/         # Controladores REST por entidad
│   ├── services/           # Lógica de negocio y operaciones
│   ├── routes/             # Definición de endpoints API
│   ├── middlewares/        # Middleware personalizado (auth, logging, validation)
│   ├── db/                 # Configuración de base de datos
│   ├── types/              # Definiciones de tipos TypeScript
│   └── utils/              # Utilidades y helpers
├── prisma/                 # Esquemas, migraciones y seeds
├── tests/                  # Suite de tests unitarios
└── logs/                   # Sistema de logging estructurado
```

### **Frontend Architecture**
```
src/
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes base (shadcn/ui)
│   └── generic/           # Componentes genéricos de negocio
├── pages/                 # Páginas y vistas principales
├── hooks/                 # Custom hooks para lógica compartida
├── services/              # Servicios de comunicación con API
├── store/                 # Gestión de estado global
├── types/                 # Definiciones de tipos y schemas
└── utils/                 # Utilidades y helpers del frontend
```

## 🛠️ Stack Tecnológico

### **Backend**
- **Runtime**: Node.js 20+ con TypeScript
- **Framework**: Express.js con arquitectura REST
- **ORM**: Prisma con SQLite (migrable a PostgreSQL)
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Zod schemas para type-safe validation
- **Testing**: Jest para testing unitario
- **Logging**: Sistema de logs estructurado por módulos

### **Frontend**
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite para desarrollo y build optimizado
- **UI Library**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS con CSS Variables
- **Routing**: React Router v6 con rutas protegidas
- **HTTP Client**: Axios con interceptors personalizados
- **State Management**: Custom hooks + Context API

### **DevOps & Tools**
- **Database**: SQLite (desarrollo) / PostgreSQL (producción)
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git con conventional commits

---

## 📦 Prerrequisitos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Git** >= 2.40.0

---

## 🚀 Instalación y Configuración

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/Luis-Prendas/sigeor-workspace.git
cd sigeor-workspace
```

### 2. **Configuración del Backend**
```bash
cd backend
npm install
```

**Configurar variables de entorno:**
```bash
cp .env.example .env
```

```env
# Backend Environment Variables
SECRET_KEY="your-super-secret-jwt-key-here"
PORT="3001"
DATABASE_URL="file:./database.sqlite"
NODE_ENV="development"
```

### 3. **Configuración del Frontend**
```bash
cd ../
npm install
```

**Configurar variables de entorno:**
```bash
cp .env.example .env
```

```env
# Frontend Environment Variables
VITE_API_URL="http://localhost:3001/api"
VITE_SOCKET_URL="http://localhost:3001"
VITE_SITE_URL="http://localhost:5173"
```

### 4. **Inicialización de la Base de Datos**
```bash
cd backend
npm run reset:prisma
```

> ⚠️ **Advertencia**: Este comando resetea completamente la base de datos y carga datos de prueba.

### 5. **Ejecutar la Aplicación**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs (si está configurado)

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT No-Commercial License (MIT-NC)**.  
Puedes usar, modificar y compartir el código libremente con fines personales, educativos o experimentales.  

⚠️ **No se permite el uso con fines comerciales**, incluyendo venta, SaaS, monetización directa o indirecta.  

Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **Luis Prendas** - *Desarrollo Principal* - [@Luis-Prendas](https://github.com/Luis-Prendas)

---


- [Prisma](https://prisma.io/) por el excelente ORM
- [shadcn/ui](https://ui.shadcn.com/) por los componentes de UI
- [Vite](https://vitejs.dev/) por la herramienta de build ultrarrápida
- Comunidad de TypeScript por el ecosistema robusto

---

**¿Encontraste un bug o tienes una sugerencia?** [Abre un issue](https://github.com/Luis-Prendas/sigeor-workspace/issues)