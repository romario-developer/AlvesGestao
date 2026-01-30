import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
