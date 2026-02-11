import { PrismaService } from '../prisma/prisma.service';
export declare class QrsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBulk(codes: string[]): Promise<{
        created: number;
    }>;
    findAvailable(): Promise<{
        id: string;
        code: string;
        status: import("@prisma/client").$Enums.QRStatus;
        assignedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
