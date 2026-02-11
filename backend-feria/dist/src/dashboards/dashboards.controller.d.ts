import { DashboardsService } from './dashboards.service';
import { JwtPayload } from '../auth/jwt.strategy';
export declare class DashboardsController {
    private readonly dashboardsService;
    constructor(dashboardsService: DashboardsService);
    getEntries(): Promise<{
        totalStudents: number;
        byGender: {
            gender: import("@prisma/client").$Enums.Gender;
            count: number;
        }[];
        byAgeRange: Record<string, number>;
        byEducationUnit: Record<string, number>;
    }>;
    getStands(): Promise<{
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
    getMyStand(req: {
        user: JwtPayload;
    }): Promise<{
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
