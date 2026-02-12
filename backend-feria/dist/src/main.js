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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const bcrypt = __importStar(require("bcrypt"));
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
const client_1 = require("@prisma/client");
async function seedAdmin(prisma) {
    const email = process.env.ADMIN_EMAIL ?? 'admin@feria.com';
    const password = process.env.ADMIN_PASSWORD ?? 'admin123';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return;
    }
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            email,
            password: hashed,
            role: client_1.Role.ADMIN,
        },
    });
}
async function seedStands(prisma) {
    const count = await prisma.stand.count();
    if (count > 0)
        return;
    const stands = [
        { name: 'Stand Ahorro', cooperativeName: 'Cooperativa Ahorro', contentType: client_1.ContentType.AHORRO, isMandatory: true },
        { name: 'Stand Fraude', cooperativeName: 'Cooperativa Fraude', contentType: client_1.ContentType.FRAUDE, isMandatory: true },
        { name: 'Stand Crédito', cooperativeName: 'Cooperativa Crédito', contentType: client_1.ContentType.CREDITO, isMandatory: false },
        { name: 'Stand Presupuesto', cooperativeName: 'Cooperativa Presupuesto', contentType: client_1.ContentType.PRESUPUESTO, isMandatory: false },
        { name: 'Stand Inversión', cooperativeName: 'Cooperativa Inversión', contentType: client_1.ContentType.INVERSION, isMandatory: false },
        { name: 'Stand Seguros', cooperativeName: 'Cooperativa Seguros', contentType: client_1.ContentType.SEGUROS, isMandatory: false },
    ];
    await prisma.stand.createMany({ data: stands });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:4200'],
        credentials: true,
    });
    const prisma = app.get(prisma_service_1.PrismaService);
    await seedAdmin(prisma);
    await seedStands(prisma);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map