import { type DataBase, UserRole } from "../types/DataBase";

const now = new Date().toISOString();

export const DB: DataBase = {
  auditLogs: [],

  // =======================
  // Organización
  // =======================
  organizations: [
    {
      id: 'org000',
      organizationCode: '0000',
      corporateName: 'Administración',
      displayName: 'Administración',
      logoUrl: null,
      slogan: null,
      description: 'Servicio de administración del sistema',
      createdAt: now,
      updatedAt: now,
      createdBy: 'system',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      isDeleted: false
    },
  ],

  // =======================
  // Departamentos
  // =======================
  departments: [
    {
      id: 'dpt000',
      organizationId: 'org000',
      name: 'Administración',
      description: 'Departamento de administración del sistema',
      createdAt: now,
      updatedAt: now,
      createdBy: 'system',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      isDeleted: false
    },
  ],

  // =======================
  // Puestos
  // =======================
  positions: [
    // Administración
    {
      id: 'pos000',
      departmentId: 'dpt000',
      maleName: 'Gerente de Administración',
      femaleName: 'Gerenta de Administración',
      description: 'Administración',
      createdAt: now,
      updatedAt: now,
      createdBy: 'system',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      isDeleted: false
    }
  ],

  // =======================
  // Usuarios
  // =======================
  users: [
    {
      id: 'system',
      email: 'luisprendas.dev@gmail.com',
      username: 'az',
      password: 'az',
      nickname: 'Simil',
      name: 'Luis Daniel',
      lastName: 'Prendas Chavarría',
      phone: '7242-7611',
      address: 'San Diego, Cartago, Costa Rica',
      birthDate: new Date('1999-09-08').toISOString(),
      gender: 'M',
      indentificationNumber: '1-1755-0348',
      role: UserRole.DEVELOPER,
      description: 'Cuenta principal del sistema',
      organizationId: 'org000',
      createdAt: now,
      updatedAt: now,
      createdBy: 'system',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      isDeleted: false
    }
  ],

  // =======================
  // Relación Usuario ↔ Puesto
  // =======================
  userPositions: [
    {
      id: 'up000',
      userId: 'system',
      positionId: 'pos000',
      createdAt: now,
      updatedAt: now,
      createdBy: 'system',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      isDeleted: false
    }
  ],

  // =======================
  // Horarios
  // =======================
  schedules: [],

  // =======================
  // Asistencia
  // =======================
  attendance: []
};
