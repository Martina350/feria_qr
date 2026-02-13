"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCooperativa(input) {
        const existing = await this.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('El correo ya está registrado');
        }
        const stand = await this.prisma.stand.findUnique({
            where: { id: input.standId },
        });
        if (!stand) {
            throw new common_1.BadRequestException('Stand no encontrado');
        }
        const hashed = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                password: hashed,
                role: client_1.Role.COOPERATIVA,
                standId: input.standId,
            },
        });
        const { password, ...rest } = user;
        return rest;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                standId: true,
                createdAt: true,
                stand: {
                    select: { id: true, name: true, cooperativeName: true },
                },
            },
        });
        return users;
    }
    async updateRole(id, role) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        await this.prisma.user.update({
            where: { id },
            data: { role },
        });
        return this.findUserById(id);
    }
    async updateStand(id, standId) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        if (standId) {
            const stand = await this.prisma.stand.findUnique({ where: { id: standId } });
            if (!stand) {
                throw new common_1.BadRequestException('Stand no encontrado');
            }
        }
        await this.prisma.user.update({
            where: { id },
            data: { standId },
        });
        return this.findUserById(id);
    }
    findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                standId: true,
                stand: { select: { id: true, name: true, cooperativeName: true } },
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map