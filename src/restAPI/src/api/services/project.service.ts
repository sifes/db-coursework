import { Injectable } from '@nestjs/common';
import { ProjectRepository } from 'src/database/repositories/project.repository';
import { CreateProjectDto } from 'src/shared/dto/create-project.dto';
import { UpdateProjectDto } from 'src/shared/dto/update-project.dto';
import { InvalidEntityIdException } from 'src/shared/exceptions/invalid-entity-id.exception';
import { InvalidInputDataException } from 'src/shared/exceptions/invalid-input-data.exception';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async create(data: CreateProjectDto) {
    if (data.name && data.name.length < 3) {
      throw new InvalidInputDataException(
        'name',
        'Name must be at least 3 characters'
      );
    }
    return await this.projectRepository.create(data);
  }

  async get(id: number) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new InvalidEntityIdException('Project');
    return project;
  }

  async getAll() {
    return await this.projectRepository.findMany();
  }

  async update(id: number, body: UpdateProjectDto) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new InvalidEntityIdException('Project');

    if (body.name && body.name.length < 3) {
      throw new InvalidInputDataException(
        'name',
        'Name must be at least 3 characters'
      );
    }

    return await this.projectRepository.updateById(id, body);
  }

  async delete(id: number) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new InvalidEntityIdException('Project');

    return await this.projectRepository.deleteById(id);
  }
}
