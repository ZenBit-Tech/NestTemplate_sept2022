import { Module } from '@nestjs/common/decorators';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entity/user.entity';
import { UserController } from 'modules/user/user.controller';
import { UserService } from 'modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
