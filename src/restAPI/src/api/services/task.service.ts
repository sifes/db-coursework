import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TaskRepository } from 'src/database/repositories/task.repository';
import { CreateTaskDto } from 'src/shared/dto/create-task.dto';
import { UpdateTaskDto } from 'src/shared/dto/update-task.dto';
import { AlreadyExistException } from 'src/shared/exceptions/already-exist.exception';
import { InvalidEntityIdException } from 'src/shared/exceptions/invalid-entity-id.exception';
import { InvalidInputDataException } from 'src/shared/exceptions/invalid-input-data.exception';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async create(data: CreateTaskDto) {
    if (!data.name || !data.status) {
      throw new InvalidInputDataException(
        'name or status',
        'Field is required'
      );
    }
    try {
      const task = await this.taskRepository.create(data);
      return task;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AlreadyExistException('Task');
        }
      }
      throw error;
    }
  }

  async get(id: number) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new InvalidEntityIdException('Task');
    return task;
  }

  async getAll() {
    return await this.taskRepository.findMany();
  }

  async update(id: number, body: UpdateTaskDto) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new InvalidEntityIdException('Task');

    if (body.name && body.name.length < 3) {
      throw new InvalidInputDataException(
        'name',
        'Name must be at least 3 characters'
      );
    }

    return await this.taskRepository.updateById(id, body);
  }

  async delete(id: number) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new InvalidEntityIdException('Task');

    return await this.taskRepository.deleteById(id);
  }
}
