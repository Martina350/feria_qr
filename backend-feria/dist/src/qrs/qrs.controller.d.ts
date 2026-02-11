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
        code: string;
        status: import("@prisma/client").$Enums.QRStatus;
        assignedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
