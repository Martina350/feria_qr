export declare const ROLES_KEY = "roles";
export type AllowedRole = 'ADMIN' | 'COOPERATIVA';
export declare const Roles: (...roles: AllowedRole[]) => import("@nestjs/common").CustomDecorator<string>;
