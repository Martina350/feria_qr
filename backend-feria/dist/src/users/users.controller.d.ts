import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
    } | null>;
}
