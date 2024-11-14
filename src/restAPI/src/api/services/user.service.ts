import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserRepository } from 'src/database/repositories/user.repository';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UpdateUserDto } from 'src/shared/dto/update-user.dto';
import { AlreadyExistException } from 'src/shared/exceptions/already-exist.exception';
import { DataNotFoundException } from 'src/shared/exceptions/data-not-found.exception';
import { InvalidEntityIdException } from 'src/shared/exceptions/invalid-entity-id.exception';
import { InvalidInputDataException } from 'src/shared/exceptions/invalid-input-data.exception';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    if (!data.name || !data.email) {
      throw new InvalidInputDataException('name or email', 'Field is required');
    }
    try {
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AlreadyExistException('User');
        }
      }
      throw error;
    }
  }

  async get(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new InvalidEntityIdException('User');
    return user;
  }

  async getAll() {
    const users = await this.userRepository.findMany();
    if (users.length === 0) throw new DataNotFoundException();
    return users;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new InvalidEntityIdException('User');

    if (body.name && body.name.length < 3) {
      throw new InvalidInputDataException(
        'name',
        'Name must be at least 3 characters'
      );
    }

    return await this.userRepository.updateById(id, body);
  }

  async delete(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new InvalidEntityIdException('User');

    return await this.userRepository.deleteById(id);
  }
}
