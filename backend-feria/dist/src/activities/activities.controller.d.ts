import { ActivitiesService } from './activities.service';
import { JwtPayload } from '../auth/jwt.strategy';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    complete(body: {
        qrCodeId: string;
    }, req: {
        user: JwtPayload;
    }): Promise<{
        success: boolean;
    }>;
}
