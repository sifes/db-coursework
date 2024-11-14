# Реалізація інформаційного та програмного забезпечення

## SQL-скрипт для створення початкового наповнення бази даних

_migrate.sql_

```sql
-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('ADMINISTRATOR', 'MANAGER', 'WORKER') NOT NULL,
    `description` VARCHAR(64) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grant` (
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profilePicture` VARCHAR(255) NULL,
    `status` ENUM('BANNED', 'NOT_BANNED') NOT NULL DEFAULT 'NOT_BANNED',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `status` VARCHAR(16) NOT NULL,
    `description` VARCHAR(512) NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` TIMESTAMP NULL,
    `projectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(1024) NOT NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `taskId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `link` VARCHAR(64) NOT NULL,
    `fileType` VARCHAR(16) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `taskId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,
    `color` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TasksTag` (
    `taskId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`taskId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `taskId` INTEGER NOT NULL,

    UNIQUE INDEX `Assignee_memberId_taskId_key`(`memberId`, `taskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `description` VARCHAR(512) NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Grant` ADD CONSTRAINT `Grant_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grant` ADD CONSTRAINT `Grant_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskComment` ADD CONSTRAINT `TaskComment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskComment` ADD CONSTRAINT `TaskComment_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TasksTag` ADD CONSTRAINT `TasksTag_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TasksTag` ADD CONSTRAINT `TasksTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignee` ADD CONSTRAINT `Assignee_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignee` ADD CONSTRAINT `Assignee_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
```

_seed.sql_

```sql

-- Insert Permissions
INSERT INTO Permission (`name`)
VALUES
  ('CREATE_PROJECT'),
  ('UPDATE_PROJECT'),
  ('DELETE_PROJECT'),
  ('CREATE_TASK'),
  ('UPDATE_TASK'),
  ('DELETE_TASK'),
  ('CREATE_COMMENT'),
  ('UPDATE_COMMENT'),
  ('DELETE_COMMENT'),
  ('CREATE_MEMBER'),
  ('UPDATE_MEMBER'),
  ('DELETE_MEMBER'),
  ('BAN_USER'),
  ('UNBAN_USER');

-- Insert Roles
INSERT INTO Role (`name`, `description`)
VALUES
  ('ADMINISTRATOR', 'Has full access'),
  ('MANAGER', 'Manages projects and teams'),
  ('WORKER', 'Works on tasks');

-- Insert Grants
INSERT INTO `grant` (roleId, permissionId)
VALUES
-- Grants for Administrator
  (1, 1),  -- CREATE_PROJECT
  (1, 2),  -- UPDATE_PROJECT
  (1, 3),  -- DELETE_PROJECTgrant
  (1, 4),  -- CREATE_TASK
  (1, 5),  -- UPDATE_TASK
  (1, 6),  -- DELETE_TASK
  (1, 7),  -- CREATE_COMMENT
  (1, 8),  -- UPDATE_COMMENT
  (1, 9),  -- DELETE_COMMENT
  (1, 10), -- CREATE_MEMBER
  (1, 11), -- UPDATE_MEMBER
  (1, 12), -- DELETE_MEMBER
  (1, 13), -- BAN_USER
  (1, 14), -- UNBAN_USER

-- Grants for Manager
  (2, 2),  -- UPDATE_PROJECT
  (2, 4),  -- CREATE_TASK
  (2, 5),  -- UPDATE_TASK
  (2, 6),  -- DELETE_TASK
  (2, 7),  -- CREATE_COMMENT
  (2, 8),  -- UPDATE_COMMENT
  (2, 9),  -- DELETE_COMMENT
  (2, 10), -- CREATE_MEMBER
  (2, 11), -- UPDATE_MEMBER
  (2, 12), -- DELETE_MEMBER

-- Grants for Worker
  (3, 5),  -- UPDATE_TASK
  (3, 6),  -- DELETE_TASK
  (3, 7),  -- CREATE_COMMENT
  (3, 8),  -- UPDATE_COMMENT
  (3, 9);  -- DELETE_COMMENT

-- Insert Users
INSERT INTO User (`name`, `email`, `password`, `profilePicture`, `status`)
VALUES
  ('Ivan Shevchenko', 'ivan.shevchenko@example.com', 'hashed_password_1', 'https://example.com/profile1.jpg', 'NOT_BANNED'),
  ('Olga Ivanova', 'olga.ivanova@example.com', 'hashed_password_2', 'https://example.com/profile2.jpg', 'NOT_BANNED'),
  ('Natalia Kovalenko', 'natalia.kovalenko@example.com', 'hashed_password_3', NULL, 'NOT_BANNED'),
  ('Mykola Petrov', 'mykola.petrov@example.com', 'hashed_password_4', 'https://example.com/profile4.jpg', 'NOT_BANNED'),
  ('Daryna Tarasenko', 'daryna.tarasenko@example.com', 'hashed_password_5', 'https://example.com/profile5.jpg', 'NOT_BANNED');

-- Insert Project
INSERT INTO Project (`name`, `description`, `creationDate`, `status`)
VALUES
  ('Project Alpha', 'A description for Project Alpha', '2024-11-01 00:00:00', 'ACTIVE');

-- Insert Members
INSERT INTO Member (`userId`, `projectId`, `roleId`)
VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 1, 3),
  (5, 1, 3);

-- Insert Tasks
INSERT INTO Task (`name`, `status`, `description`, `startDate`, `dueDate`, `projectId`)
VALUES
  ('Task 1', 'OPEN', 'Task 1 description', '2024-11-01 09:00:00', '2024-11-10 18:00:00', 1);

-- Insert Task Comments
INSERT INTO TaskComment (`content`, `creationDate`, `taskId`, `authorId`)
VALUES
  ('This is the first comment on Task 1', '2024-11-01 10:00:00', 1, 1);

-- Insert Tags
INSERT INTO Tag (`name`, `color`)
VALUES
  ('Backend', '#FF5733'),   -- Red
  ('Frontend', '#33C1FF'),  -- Blue
  ('Testing', '#FF9800');   -- Orange

-- Insert Task Tags
INSERT INTO TasksTag (`taskId`, `tagId`)
VALUES
  (1, 1);  -- Task 1 tagged with Backend

-- Insert Assignees
INSERT INTO Assignee (`memberId`, `taskId`)
VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1);
```

## RESTfull сервіс для управління даними

### Схема бази даних Prisma ORM

```prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// PERMISSION_MANAGEMENT
enum RoleName {
  Administrator
  Manager
  Worker
}

model Permission {
  id     Int     @id @default(autoincrement())
  name   String  @unique @db.VarChar(64)
  grants Grant[]
}

model Role {
  id          Int      @id @default(autoincrement())
  name        RoleName
  description String?  @db.VarChar(64)

  members Member[]
  grants  Grant[]
}

model Grant {
  roleId       Int @map("role_id")
  permissionId Int @map("permission_id")

  role       Role       @relation(fields: [roleId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
}

// USER_MANAGEMENT
enum UserStatus {
  BANNED
  NOT_BANNED
}

model User {
  id             Int        @id @default(autoincrement())
  name           String     @db.VarChar(255)
  email          String     @unique @db.VarChar(255)
  password       String     @db.VarChar(255)
  profilePicture String?    @db.VarChar(255)
  status         UserStatus @default(NOT_BANNED)

  members   Member[]
  assignees Assignee[]
}

// TASK_MANAGEMENT
model Task {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(64)
  status      String    @db.VarChar(16)
  description String?   @db.VarChar(512)
  startDate   DateTime  @db.Timestamp()
  dueDate     DateTime? @db.Timestamp()
  projectId   Int

  comments    TaskComment[]
  attachments Attachment[]
  tags        TasksTag[]
  assignees   Assignee[]
  project     Project       @relation(fields: [projectId], references: [id])
}

model TaskComment {
  id           Int      @id @default(autoincrement())
  content      String   @db.VarChar(1024)
  creationDate DateTime @db.Timestamp()
  taskId       Int
  authorId     Int

  author Member @relation(fields: [authorId], references: [id])
  task   Task   @relation(fields: [taskId], references: [id])
}

model Attachment {
  id       Int    @id @default(autoincrement())
  link     String @db.VarChar(64)
  fileType String @db.VarChar(16)
  fileSize Int

  taskId Int

  task Task @relation(fields: [taskId], references: [id])
}

model Tag {
  id       Int        @id @default(autoincrement())
  name     String     @db.VarChar(16)
  color    String     @db.VarChar(16)
  TasksTag TasksTag[]
}

model TasksTag {
  id     Int @id @default(autoincrement())
  taskId Int
  tagId  Int

  task Task @relation(fields: [taskId], references: [id])
  tag  Tag  @relation(fields: [tagId], references: [id])

  @@unique([taskId, tagId])
}

model Assignee {
  id     Int @id @default(autoincrement())
  userId Int
  taskId Int

  user User @relation(fields: [userId], references: [id])
  task Task @relation(fields: [taskId], references: [id])

  @@unique([userId, taskId])
}

model Member {
  id        Int @id @default(autoincrement())
  userId    Int
  projectId Int
  roleId    Int @map("role_id")

  user        User?         @relation(fields: [userId], references: [id])
  role        Role?         @relation(fields: [roleId], references: [id])
  TaskComment TaskComment[]
  project     Project       @relation(fields: [projectId], references: [id])
}

// PROJECT_MANAGEMENT
enum ProjectStatus {
  ACTIVE
  INACTIVE
}

model Project {
  id           Int           @id @default(autoincrement())
  name         String        @db.VarChar(64)
  description  String?       @db.VarChar(512)
  creationDate DateTime      @db.Timestamp()
  status       ProjectStatus

  tasks   Task[]
  members Member[]
}

```

### Головний файл програми

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port = process.env.PORT || 3000;

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);

	const config = new DocumentBuilder().setTitle('DB-2024 course API').setDescription('The DB-2024 course API description').setVersion('1.0').build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(port);

	console.info(`Started server on 127.0.0.1:${port}`);
}
bootstrap();
```

### Головні модулі програми

#### Всього застосунку

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ApiModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
```

#### Головний модуль API

```ts
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { TaskModule } from './modules/task.module';
import { ProjectModule } from './modules/project.module';

@Module({
	imports: [UserModule, TaskModule, ProjectModule],
})
export class ApiModule {}
```

### Підключення до бази даних

#### Модуль

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
```

#### Сервіс

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		});
	}
}
```

### Exceptions

#### AlreadyExistException

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistException extends HttpException {
	constructor(object: string) {
		super(`${object} already exists`, HttpStatus.BAD_REQUEST);
	}
}
```

#### DataNotFoundException

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class DataNotFoundException extends HttpException {
	constructor() {
		super('Data were not found', HttpStatus.BAD_REQUEST);
	}
}
```

#### InvalidEntityIdException

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEntityIdException extends HttpException {
	constructor(entity: string) {
		super(`${entity} with such id is not found`, HttpStatus.BAD_REQUEST);
	}
}
```

#### InvalidInputDataException

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidInputDataException extends HttpException {
	constructor(field: string, reason: string) {
		super(`Invalid data for ${field}: ${reason}`, HttpStatus.BAD_REQUEST);
	}
}
```

### Users

#### Модуль

```ts
import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from 'src/database/repositories/user.repository';
import { PrismaModule } from './prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserService],
})
export class UserModule {}
```

#### Контроллер

```ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/shared/dto/update-user.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
	constructor(private userService: UserService) {}

	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'Successfully retrieved users' })
	@Get()
	async getAll() {
		return await this.userService.getAll();
	}

	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiResponse({ status: 200, description: 'Successfully retrieved the user' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiParam({ name: 'id', description: 'ID of the user', type: Number })
	@Get(':id')
	async get(@Param('id', ParseIntPipe) userId: number) {
		return await this.userService.get(userId);
	}

	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({ status: 201, description: 'User successfully created' })
	@ApiResponse({ status: 400, description: 'Invalid input data' })
	@Post()
	async create(@Body() dto: CreateUserDto) {
		return await this.userService.create(dto);
	}

	@ApiOperation({ summary: 'Update an existing user' })
	@ApiResponse({ status: 200, description: 'User successfully updated' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiParam({ name: 'id', description: 'ID of the user', type: Number })
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) userId: number, @Body() dto: UpdateUserDto) {
		return await this.userService.update(userId, dto);
	}

	@ApiOperation({ summary: 'Delete a user by ID' })
	@ApiResponse({ status: 200, description: 'User successfully deleted' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiParam({ name: 'id', description: 'ID of the user', type: Number })
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) userId: number) {
		return await this.userService.delete(userId);
	}
}
```

#### Сервіс

```ts
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
			throw new InvalidInputDataException('name', 'Name must be at least 3 characters');
		}

		return await this.userRepository.updateById(id, body);
	}

	async delete(id: number) {
		const user = await this.userRepository.findById(id);
		if (!user) throw new InvalidEntityIdException('User');

		return await this.userRepository.deleteById(id);
	}
}
```

#### Репозиторій

```ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/api/services/prisma.service';

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	private include = {
		members: true,
	};

	async create(data: Prisma.UserCreateInput) {
		return this.prisma.user.create({
			data,
			include: this.include,
		});
	}

	async findById(id: number) {
		return this.prisma.user.findUnique({
			where: { id },
			include: this.include,
		});
	}

	async updateById(id: number, data: Prisma.UserUpdateInput) {
		return this.prisma.user.update({
			where: { id },
			data,
			include: this.include,
		});
	}

	async findMany() {
		return this.prisma.user.findMany({
			include: this.include,
		});
	}

	async count(data: Prisma.UserCountArgs) {
		return this.prisma.user.count(data);
	}

	async deleteById(id: number) {
		return this.prisma.user.delete({
			where: { id },
			include: this.include,
		});
	}
}
```

#### DTO`s

##### Створення

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ description: 'Name of the user', example: 'John Doe' })
	@IsString()
	@Length(1, 255)
	name: string;

	@ApiProperty({
		description: 'Email of the user',
		example: 'johndoe@example.com',
	})
	@IsEmail()
	@Length(1, 255)
	email: string;

	@ApiProperty({ description: 'Password for the user', example: 'P@ssw0rd!' })
	@IsString()
	@Length(8, 255)
	password: string;

	@ApiProperty({
		description: 'Profile picture URL of the user',
		example: 'https://example.com/profile.jpg',
		required: false,
	})
	@IsOptional()
	@IsString()
	@Length(1, 255)
	profilePicture?: string;
}
```

##### Оновлення

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
	@ApiPropertyOptional({ example: 'John Doe' })
	@IsOptional()
	@IsString()
	@Length(1, 255)
	name?: string;

	@ApiPropertyOptional({ example: 'johndoe@example.com' })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ example: 'newpassword123' })
	@IsOptional()
	@IsString()
	@Length(6, 255)
	password?: string;

	@ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
	@IsOptional()
	@IsString()
	profilePicture?: string;

	@ApiPropertyOptional({ enum: UserStatus, example: UserStatus.NOT_BANNED })
	@IsOptional()
	@IsEnum(UserStatus)
	status?: UserStatus;
}
```

### Projects

#### Модуль

```ts
import { Module } from '@nestjs/common';
import { ProjectController } from '../controllers/project.controller';
import { ProjectService } from '../services/project.service';
import { ProjectRepository } from 'src/database/repositories/project.repository';
import { PrismaModule } from './prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [ProjectController],
	providers: [ProjectService, ProjectRepository],
	exports: [ProjectService],
})
export class ProjectModule {}
```

#### Контроллер

```ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
	async update(@Param('id', ParseIntPipe) projectId: number, @Body() dto: UpdateProjectDto) {
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
```

#### Сервіс

```ts
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
			throw new InvalidInputDataException('name', 'Name must be at least 3 characters');
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
			throw new InvalidInputDataException('name', 'Name must be at least 3 characters');
		}

		return await this.projectRepository.updateById(id, body);
	}

	async delete(id: number) {
		const project = await this.projectRepository.findById(id);
		if (!project) throw new InvalidEntityIdException('Project');

		return await this.projectRepository.deleteById(id);
	}
}
```

#### Репозиторій

```ts
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
```

#### DTO`s

##### Створення

```ts
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
```

##### Оновлення

```ts
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
```

### Tasks

#### Модуль

```ts
import { Module } from '@nestjs/common';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { TaskRepository } from 'src/database/repositories/task.repository';
import { PrismaModule } from './prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [TaskController],
	providers: [TaskService, TaskRepository],
	exports: [TaskService],
})
export class TaskModule {}
```

#### Контроллер

```ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
	async update(@Param('id', ParseIntPipe) taskId: number, @Body() dto: UpdateTaskDto) {
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
```

#### Сервіс

```ts
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
			throw new InvalidInputDataException('name or status', 'Field is required');
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
			throw new InvalidInputDataException('name', 'Name must be at least 3 characters');
		}

		return await this.taskRepository.updateById(id, body);
	}

	async delete(id: number) {
		const task = await this.taskRepository.findById(id);
		if (!task) throw new InvalidEntityIdException('Task');

		return await this.taskRepository.deleteById(id);
	}
}
```

#### Репозиторій

```ts
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
```

#### DTO`s

##### Створення

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, IsDateString, IsArray, ArrayNotEmpty } from 'class-validator';

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
```

##### Оновлення

```ts
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```
