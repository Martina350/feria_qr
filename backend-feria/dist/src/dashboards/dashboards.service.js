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
exports.DashboardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardsService = class DashboardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEntriesDashboard() {
        const totalStudents = await this.prisma.student.count();
        const byGender = await this.prisma.student.groupBy({
            by: ['gender'],
            _count: { _all: true },
        });
        const students = await this.prisma.student.findMany({
            select: {
                id: true,
                age: true,
                gender: true,
                unitEducation: true,
                city: true,
                province: true,
            },
        });
        const byAgeRange = {};
        const ranges = [
            { key: '5-8', min: 5, max: 8 },
            { key: '9-12', min: 9, max: 12 },
            { key: '13-17', min: 13, max: 17 },
            { key: '18-25', min: 18, max: 25 },
            { key: '26+', min: 26, max: 200 },
        ];
        for (const r of ranges) {
            byAgeRange[r.key] = students.filter((s) => s.age >= r.min && s.age <= r.max).length;
        }
        const byEducationUnit = {};
        for (const s of students) {
            byEducationUnit[s.unitEducation] =
                (byEducationUnit[s.unitEducation] ?? 0) + 1;
        }
        return {
            totalStudents,
            byGender: byGender.map((g) => ({
                gender: g.gender,
                count: g._count._all,
            })),
            byAgeRange,
            byEducationUnit,
        };
    }
    async getStandsDashboard() {
        const stands = await this.prisma.stand.findMany({
            select: {
                id: true,
                name: true,
                cooperativeName: true,
                contentType: true,
            },
        });
        const completions = await this.prisma.activityCompletion.findMany({
            select: {
                standId: true,
                studentId: true,
                contentType: true,
                student: {
                    select: {
                        age: true,
                        gender: true,
                    },
                },
            },
        });
        const byStand = {};
        const ageRanges = [
            { key: '5-8', min: 5, max: 8 },
            { key: '9-12', min: 9, max: 12 },
            { key: '13-17', min: 13, max: 17 },
            { key: '18-25', min: 18, max: 25 },
            { key: '26+', min: 26, max: 200 },
        ];
        const seenStudentsPerStand = new Map();
        for (const c of completions) {
            if (!byStand[c.standId]) {
                byStand[c.standId] = {
                    totalStudents: 0,
                    byGender: {},
                    byAgeRange: {},
                    byContentType: {},
                };
                ageRanges.forEach((r) => (byStand[c.standId].byAgeRange[r.key] = 0));
            }
            if (!seenStudentsPerStand.has(c.standId)) {
                seenStudentsPerStand.set(c.standId, new Set());
            }
            const set = seenStudentsPerStand.get(c.standId);
            if (!set.has(c.studentId)) {
                set.add(c.studentId);
                byStand[c.standId].totalStudents += 1;
                const gender = c.student.gender;
                byStand[c.standId].byGender[gender] =
                    (byStand[c.standId].byGender[gender] ?? 0) + 1;
                const age = c.student.age;
                const range = ageRanges.find((r) => age >= r.min && age <= r.max);
                if (range) {
                    byStand[c.standId].byAgeRange[range.key] += 1;
                }
            }
            const ct = c.contentType;
            byStand[c.standId].byContentType[ct] =
                (byStand[c.standId].byContentType[ct] ?? 0) + 1;
        }
        return stands.map((s) => ({
            ...s,
            metrics: byStand[s.id] ?? {
                totalStudents: 0,
                byGender: {},
                byAgeRange: ageRanges.reduce((acc, r) => ({ ...acc, [r.key]: 0 }), {}),
                byContentType: {},
            },
        }));
    }
    async getMyStandDashboard(standId) {
        if (!standId) {
            return null;
        }
        const stand = await this.prisma.stand.findUnique({
            where: { id: standId },
        });
        if (!stand) {
            return null;
        }
        const [result] = await this.getStandsDashboard().then((all) => all.filter((s) => s.id === standId));
        return result ?? { ...stand, metrics: null };
    }
    async exportData() {
        const students = await this.prisma.student.findMany({
            include: {
                qrCode: { select: { code: true } },
                activities: {
                    include: {
                        stand: { select: { name: true, cooperativeName: true, contentType: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const rows = [
            [
                'Nombre',
                'Apellido',
                'Edad',
                'Género',
                'Unidad Educativa',
                'Ciudad',
                'Provincia',
                'Código QR',
                'Completado',
                'Fecha Completado',
                'Actividades Realizadas',
            ],
        ];
        for (const s of students) {
            const activitiesDesc = s.activities
                .map((a) => `${a.stand.cooperativeName} - ${a.stand.contentType}`)
                .join('; ');
            rows.push([
                s.firstName,
                s.lastName,
                String(s.age),
                s.gender,
                s.unitEducation,
                s.city,
                s.province,
                s.qrCode.code,
                s.isCompleted ? 'Sí' : 'No',
                s.completedAt ? s.completedAt.toISOString() : '',
                activitiesDesc,
            ]);
        }
        const csv = rows
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        return { csv };
    }
};
exports.DashboardsService = DashboardsService;
exports.DashboardsService = DashboardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardsService);
//# sourceMappingURL=dashboards.service.js.map