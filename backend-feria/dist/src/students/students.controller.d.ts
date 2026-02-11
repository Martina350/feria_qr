import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    register(body: {
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
    completionStatus(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        isCompleted: boolean;
        completedAt: Date | null;
        activitiesCount: number;
    }>;
}
