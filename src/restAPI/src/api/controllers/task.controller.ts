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
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from 'src/shared/dto/create-task.dto';
import { UpdateTaskDto } from 'src/shared/dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved tasks' })
  @Get()
  async getAll() {
    return await this.taskService.getAll();
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: Number })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) taskId: number) {
    return await this.taskService.get(taskId);
  }

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return await this.taskService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: Number })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto
  ) {
    return await this.taskService.update(taskId, dto);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: Number })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) taskId: number) {
    return await this.taskService.delete(taskId);
  }
}
