import { StandsService } from './stands.service';
export declare class StandsController {
    private readonly standsService;
    constructor(standsService: StandsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
        isMandatory: boolean;
    }[]>;
    create(body: {
        name: string;
        cooperativeName: string;
        contentType: 'AHORRO' | 'FRAUDE' | 'CREDITO' | 'PRESUPUESTO' | 'INVERSION' | 'SEGUROS';
        isMandatory?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
        isMandatory: boolean;
    }>;
}
