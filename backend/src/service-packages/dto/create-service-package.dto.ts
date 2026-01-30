import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PackageItemDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsNumber()
  quantidade?: number;
}

export class CreateServicePackageDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  precoBase: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItemDto)
  items?: PackageItemDto[];
}

export class PackageItem extends PackageItemDto {}
