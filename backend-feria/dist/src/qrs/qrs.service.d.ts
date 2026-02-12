import { PrismaService } from '../prisma/prisma.service';
export declare class QrsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBulk(codes: string[]): Promise<{
        created: number;
    }>;
    findAvailable(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.QRStatus;
        assignedAt: Date | null;
    }[]>;
    findAll(): Promise<({
        student: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.QRStatus;
        assignedAt: Date | null;
    })[]>;
}
