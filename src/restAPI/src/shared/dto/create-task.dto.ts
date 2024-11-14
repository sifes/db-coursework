import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Name of the task',
    example: 'Develop login feature',
  })
  @IsString()
  @Length(1, 64)
  name: string;

  @ApiProperty({ description: 'Status of the task', example: 'In Progress' })
  @IsString()
  @Length(1, 16)
  status: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Implement the user login functionality',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 512)
  description?: string;

  @ApiProperty({
    description: 'Due date of the task',
    example: '2023-01-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({ description: 'ID of the associated project', example: 1 })
  @IsInt()
  projectId: number;

  @ApiProperty({
    description: 'List of assignee IDs for the task',
    example: [1, 2],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  assignees: number[];
}
