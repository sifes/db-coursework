import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Name of the project', example: 'Project Alpha' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the project',
    example: 'This project is focused on development.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
