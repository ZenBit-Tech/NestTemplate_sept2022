import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { EmailDto } from './dto/login-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { User } from './entity/user.entity';
import {
  SEND_PASSWORD_RESET,
  SUCCESSFULLY_DELETE_USER,
  SUCCESSFULLY_PASSWORD_RESET,
} from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async sendToken(userEmail: EmailDto): Promise<{ message: string }> {
    try {
      const { email } = userEmail;

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        return {
          message: SEND_PASSWORD_RESET,
        };
      }

      const newToken = randomUUID();

      await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({ passwordResetToken: newToken })
        .where('id = :id', { id: user.id })
        .execute();

      return {
        message: SEND_PASSWORD_RESET,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async recoverPassword(
    recoverPasswordDto: RecoverPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { newPassword, email, token } = recoverPasswordDto;

      return {
        message: SUCCESSFULLY_PASSWORD_RESET,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();

      return {
        message: SUCCESSFULLY_DELETE_USER,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
