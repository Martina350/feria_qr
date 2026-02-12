import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
    }>;
    register(body: {
        email: string;
        password: string;
        standId?: string | null;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        standId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
