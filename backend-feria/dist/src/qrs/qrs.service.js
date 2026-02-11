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
exports.QrsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QrsService = class QrsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBulk(codes) {
        if (!codes.length) {
            return { created: 0 };
        }
        const data = codes.map((code) => ({ code }));
        const result = await this.prisma.qRCode.createMany({
            data,
            skipDuplicates: true,
        });
        return { created: result.count };
    }
    async findAvailable() {
        const qrs = await this.prisma.qRCode.findMany({
            where: { status: 'DISPONIBLE' },
            orderBy: { createdAt: 'asc' },
        });
        return qrs;
    }
};
exports.QrsService = QrsService;
exports.QrsService = QrsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrsService);
//# sourceMappingURL=qrs.service.js.map