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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async completeActivity(input) {
        const qr = await this.findQrByIdOrCode(input.qrCodeId);
        if (!qr || qr.status !== 'ASIGNADO' || !qr.student) {
            throw new common_1.BadRequestException('QR no válido o no asignado a estudiante');
        }
        const studentId = qr.student.id;
        if (!input.standId) {
            throw new common_1.BadRequestException('El stand asociado al usuario no es válido');
        }
        const stand = await this.prisma.stand.findUnique({
            where: { id: input.standId },
        });
        if (!stand) {
            throw new common_1.BadRequestException('Stand no encontrado');
        }
        const contentType = stand.contentType;
        await this.prisma.activityCompletion.create({
            data: {
                studentId,
                standId: input.standId,
                contentType,
                completedBy: input.completedBy,
            },
        });
        await this.evaluateCompletion(studentId);
        return { success: true };
    }
    async findQrByIdOrCode(idOrCode) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
        return this.prisma.qRCode.findFirst({
            where: isUuid ? { id: idOrCode } : { code: idOrCode },
            include: { student: true },
        });
    }
    async evaluateCompletion(studentId) {
        const mandatoryStands = await this.prisma.stand.findMany({
            where: { isMandatory: true },
            select: { id: true },
        });
        const mandatoryStandIds = mandatoryStands.map((s) => s.id);
        let completedAllMandatoryStands = false;
        if (mandatoryStandIds.length > 0) {
            const completionsOnMandatory = await this.prisma.activityCompletion.groupBy({
                by: ['standId'],
                where: {
                    studentId,
                    standId: { in: mandatoryStandIds },
                },
            });
            const completedStandIds = completionsOnMandatory.map((c) => c.standId);
            completedAllMandatoryStands = mandatoryStandIds.every((id) => completedStandIds.includes(id));
        }
        const contentsOnStudent = await this.prisma.activityCompletion.groupBy({
            by: ['contentType'],
            where: { studentId },
        });
        const completedContentTypes = contentsOnStudent.map((c) => c.contentType);
        const allContentTypes = [
            'AHORRO',
            'FRAUDE',
            'CREDITO',
            'PRESUPUESTO',
            'INVERSION',
            'SEGUROS',
        ];
        const completedAllContentTypes = allContentTypes.every((ct) => completedContentTypes.includes(ct));
        const isCompleted = completedAllMandatoryStands || completedAllContentTypes;
        if (isCompleted) {
            await this.prisma.student.update({
                where: { id: studentId },
                data: {
                    isCompleted: true,
                    completedAt: new Date(),
                },
            });
        }
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map