import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  nomeCompleto!: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @IsOptional()
  endereco?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
