import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
  @ApiProperty({ description: 'Name of the project', example: 'Project Alpha' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the project',
    example: 'This project is focused on development.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Status of the project',
    example: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
