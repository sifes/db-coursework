import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/api/services/prisma.service';
import { CreateTaskDto } from 'src/shared/dto/create-task.dto';
import { UpdateTaskDto } from 'src/shared/dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  private include = {
    attachments: true,
    tags: {
      include: {
        tag: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    },
  };

  async create(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        name: data.name,
        status: data.status,
        description: data.description,
        dueDate: data.dueDate,
        projectId: data.projectId,
        assignees: {
          create: data.assignees.map((assignee) => ({
            member: {
              connect: { id: assignee },
            },
          })),
        },
      },
      include: {
        assignees: true,
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { ...this.include, assignees: true },
    });
  }

  async updateById(id: number, data: UpdateTaskDto): Promise<Task> {
    const { assignees, ...taskData } = data;

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: taskData,
      include: { ...this.include, assignees: true },
    });

    if (assignees) {
      await this.prisma.assignee.deleteMany({
        where: { taskId: id },
      });

      await Promise.all(
        assignees.map((assignee) =>
          this.prisma.assignee.create({
            data: {
              taskId: id,
              memberId: assignee,
            },
          })
        )
      );
    }

    return updatedTask;
  }

  async findMany(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: this.include,
    });
  }

  async count(data: Prisma.TaskCountArgs): Promise<number> {
    return this.prisma.task.count(data);
  }

  async deleteById(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
      include: this.include,
    });
  }
}
