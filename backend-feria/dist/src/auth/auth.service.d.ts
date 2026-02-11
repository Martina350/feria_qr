import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    register(input: {
        email: string;
        password: string;
        role?: Role;
        standId?: string | null;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
