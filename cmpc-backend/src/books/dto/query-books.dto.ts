import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBooksDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, example: 'Ficción' })
  @IsOptional()
  @IsString()
  genero?: string;

  @ApiProperty({ required: false, example: 'Sudamericana' })
  @IsOptional()
  @IsString()
  editorial?: string;

  @ApiProperty({ required: false, example: 'Gabriel García Márquez' })
  @IsOptional()
  @IsString()
  autor?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  disponibilidad?: boolean;

  @ApiProperty({ required: false, example: 'Cien años' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'titulo' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, example: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
