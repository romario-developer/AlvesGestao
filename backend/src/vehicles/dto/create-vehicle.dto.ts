import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  clientId!: string;

  @IsNotEmpty()
  @IsString()
  tipo!: string;

  @IsNotEmpty()
  @IsString()
  placa!: string;

  @IsNotEmpty()
  @IsString()
  marca!: string;

  @IsNotEmpty()
  @IsString()
  modelo!: string;

  @IsOptional()
  @IsInt()
  ano?: number;

  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsString()
  chassi?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
