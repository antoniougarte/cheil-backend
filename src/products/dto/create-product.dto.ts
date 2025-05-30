/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;
}
