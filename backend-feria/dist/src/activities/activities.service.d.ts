import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeActivity(input: {
        qrCodeId: string;
        standId?: string | null;
        contentType: 'AHORRO' | 'FRAUDE' | 'CREDITO' | 'PRESUPUESTO' | 'INVERSION' | 'SEGUROS';
        completedBy?: string;
    }): Promise<{
        success: boolean;
    }>;
    private evaluateCompletion;
}
