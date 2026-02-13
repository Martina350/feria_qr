import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeActivity(input: {
        qrCodeId: string;
        standId?: string | null;
        completedBy?: string;
    }): Promise<{
        success: boolean;
    }>;
    private findQrByIdOrCode;
    private evaluateCompletion;
}
