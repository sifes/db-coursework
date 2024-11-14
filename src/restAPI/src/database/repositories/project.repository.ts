import { Injectable } from '@nestjs/common';
import { Project, ProjectStatus } from '@prisma/client';
import { PrismaService } from 'src/api/services/prisma.service';
import { CreateProjectDto } from 'src/shared/dto/create-project.dto';
import { UpdateProjectDto } from 'src/shared/dto/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        name: data.name,
        status: ProjectStatus.ACTIVE,
        description: data.description,
      },
    });
  }

  async findById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async updateById(id: number, data: UpdateProjectDto): Promise<Project> {
    return await this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async findMany(): Promise<Project[]> {
    return this.prisma.project.findMany({});
  }

  async deleteById(id: number): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
