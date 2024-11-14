import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from 'src/shared/dto/create-project.dto';
import { UpdateProjectDto } from 'src/shared/dto/update-project.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved projects' })
  @Get()
  async getAll() {
    return await this.projectService.getAll();
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the project',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiParam({ name: 'id', description: 'ID of the project', type: Number })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) projectId: number) {
    return await this.projectService.get(projectId);
  }

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing project' })
  @ApiResponse({ status: 200, description: 'Project successfully updated' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiParam({ name: 'id', description: 'ID of the project', type: Number })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto
  ) {
    return await this.projectService.update(projectId, dto);
  }

  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiParam({ name: 'id', description: 'ID of the project', type: Number })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) projectId: number) {
    return await this.projectService.delete(projectId);
  }
}
