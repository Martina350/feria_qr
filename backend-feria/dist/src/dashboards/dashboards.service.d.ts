import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getEntriesDashboard(): Promise<{
        totalStudents: number;
        byGender: {
            gender: import("@prisma/client").$Enums.Gender;
            count: number;
        }[];
        byAgeRange: Record<string, number>;
        byEducationUnit: Record<string, number>;
    }>;
    getStandsDashboard(): Promise<{
        metrics: {
            totalStudents: number;
            byGender: Record<string, number>;
            byAgeRange: Record<string, number>;
            byContentType: Record<string, number>;
        };
        id: string;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
    }[]>;
    getMyStandDashboard(standId: string): Promise<{
        metrics: {
            totalStudents: number;
            byGender: Record<string, number>;
            byAgeRange: Record<string, number>;
            byContentType: Record<string, number>;
        };
        id: string;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
    } | null>;
}
