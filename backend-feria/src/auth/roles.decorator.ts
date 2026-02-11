import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AllowedRole = 'ADMIN' | 'COOPERATIVA';

export const Roles = (...roles: AllowedRole[]) => SetMetadata(ROLES_KEY, roles);


