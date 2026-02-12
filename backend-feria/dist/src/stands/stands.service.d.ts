import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';
export declare class StandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
        isMandatory: boolean;
    }[]>;
    create(input: {
        name: string;
        cooperativeName: string;
        contentType: ContentType;
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
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cooperativeName: string;
        contentType: import("@prisma/client").$Enums.ContentType;
        isMandatory: boolean;
    }>;
}
