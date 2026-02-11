import { PrismaService } from '../prisma/prisma.service';
export declare class StudentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    registerStudent(input: {
        firstName: string;
        lastName: string;
        age: number;
        gender: 'MALE' | 'FEMALE' | 'OTHER';
        unitEducation: string;
        city: string;
        province: string;
        qrCodeId: string;
    }): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        age: number;
        gender: import("@prisma/client").$Enums.Gender;
        unitEducation: string;
        city: string;
        province: string;
        isCompleted: boolean;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        qrCodeId: string;
    }>;
    getCompletionStatus(studentId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        isCompleted: boolean;
        completedAt: Date | null;
        activitiesCount: number;
    }>;
}
