import { ActivitiesService } from './activities.service';
import { JwtPayload } from '../auth/jwt.strategy';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    complete(body: {
        qrCodeId: string;
        standId: string;
        contentType: 'AHORRO' | 'FRAUDE' | 'CREDITO' | 'PRESUPUESTO' | 'INVERSION' | 'SEGUROS';
    }, req: {
        user: JwtPayload;
    }): Promise<{
        success: boolean;
    }>;
}
