import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  nomeFantasia!: string;

  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  endereco?: Prisma.InputJsonValue;

  @IsOptional()
  coresTema?: Prisma.InputJsonValue;

  @IsOptional()
  nfeConfig?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  plano?: string;
}
