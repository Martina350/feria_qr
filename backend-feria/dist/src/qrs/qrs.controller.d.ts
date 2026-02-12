import { QrsService } from './qrs.service';
export declare class QrsController {
    private readonly qrsService;
    constructor(qrsService: QrsService);
    bulkCreate(body: {
        codes: string[];
    }): Promise<{
        created: number;
    }>;
    getAvailable(): Promise<{
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
