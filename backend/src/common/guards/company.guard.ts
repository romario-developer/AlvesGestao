import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user as { companyId?: string } | undefined;
    if (!user?.companyId) {
      throw new UnauthorizedException('Token sem companyId (faça login novamente)');
    }

    const headerCompanyId = request.headers['x-company-id'] as string | undefined;

    // Mantém compatibilidade: se veio header, valida
    if (headerCompanyId && headerCompanyId !== user.companyId) {
      throw new UnauthorizedException('Usuário não pertence à empresa informada');
    }

    // Fonte única (isso alimenta @Company())
    request.companyId = user.companyId;

    return true;
  }
}
