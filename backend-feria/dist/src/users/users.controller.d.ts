import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        email: string;
        password: string;
        standId: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
    }[]>;
    updateRole(id: string, body: {
        role: 'ADMIN' | 'COOPERATIVA';
    }): Promise<{
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
    } | null>;
    updateStand(id: string, body: {
        standId: string | null;
    }): Promise<{
        stand: {
            id: string;
            name: string;
            cooperativeName: string;
        } | null;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
    } | null>;
}
