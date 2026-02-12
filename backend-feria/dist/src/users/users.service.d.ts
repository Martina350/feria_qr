import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    updateRole(id: string, role: Role): Promise<{
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
    updateStand(id: string, standId: string | null): Promise<{
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
    private findUserById;
}
