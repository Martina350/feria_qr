import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
    }[]>;
    updateRole(id: string, body: {
        role: 'ADMIN' | 'COOPERATIVA';
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
    } | null>;
    updateStand(id: string, body: {
        standId: string | null;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
    } | null>;
}
