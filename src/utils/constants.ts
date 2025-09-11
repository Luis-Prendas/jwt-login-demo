const ROLES = ['user', 'moderator', 'admin', 'superadmin', 'developer']

export const ALL_ACCESS = [...ROLES]
export const PROTECTED_ACCESS = [ROLES[2], ROLES[3], ROLES[4]]
export const DEVELOPER_ACCESS = [ROLES[4]]
