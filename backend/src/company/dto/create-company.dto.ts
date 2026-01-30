import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  nomeFantasia: string;

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
  endereco?: Record<string, unknown>;

  @IsOptional()
  coresTema?: Record<string, unknown>;

  @IsOptional()
  nfeConfig?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  plano?: string;
}
