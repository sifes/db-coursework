import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { TaskModule } from './modules/task.module';
import { ProjectModule } from './modules/project.module';

@Module({
  imports: [UserModule, TaskModule, ProjectModule],
})
export class ApiModule {}
