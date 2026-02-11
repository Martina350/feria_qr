"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerStudent(input) {
        const qr = await this.prisma.qRCode.findUnique({
            where: { id: input.qrCodeId },
        });
        if (!qr || qr.status !== 'DISPONIBLE') {
            throw new common_1.BadRequestException('QR no disponible para asignación');
        }
        const student = await this.prisma.student.create({
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                age: input.age,
                gender: input.gender,
                unitEducation: input.unitEducation,
                city: input.city,
                province: input.province,
                qrCodeId: input.qrCodeId,
            },
        });
        await this.prisma.qRCode.update({
            where: { id: input.qrCodeId },
            data: {
                status: 'ASIGNADO',
                assignedAt: new Date(),
            },
        });
        return student;
    }
    async getCompletionStatus(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                activities: true,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Estudiante no encontrado');
        }
        return {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            isCompleted: student.isCompleted,
            completedAt: student.completedAt,
            activitiesCount: student.activities.length,
        };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map