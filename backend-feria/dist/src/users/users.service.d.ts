import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    updateRole(id: string, role: Role): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
    } | null>;
}
