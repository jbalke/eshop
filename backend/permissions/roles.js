export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const hasRoles = (user, roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return roles.some((role) => user.role === role);
};
