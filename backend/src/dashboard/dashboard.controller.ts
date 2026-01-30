import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DashboardService, DashboardOverview, DashboardUserPayload } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { UserRole } from '@prisma/client';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Dados consolidados para o dashboard' })
  async overview(@Req() req: Request): Promise<DashboardOverview> {
    const companyId = (req as any).companyId as string | undefined;
    const user = (req as any).user ?? {};
    const userId = user.sub ?? user.id ?? 'unknown';
    const role: UserRole = (user.role as UserRole) ?? UserRole.OPERATOR;
    const userName = user.name ?? user.nome ?? 'Usuário';

    if (!companyId) {
      throw new UnauthorizedException('companyId não encontrado no request');
    }

    const payload: DashboardUserPayload = {
      companyId,
      userId,
      role,
      userName,
    };

    return this.dashboardService.getOverview(payload);
  }
}
