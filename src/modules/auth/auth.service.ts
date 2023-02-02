import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'modules/user/entity/user.entity';
import { ILoginRes } from 'modules/auth/interfaces/login-res.interface';
import { TokenPayload } from 'modules/auth/interfaces/token-payload.interface';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { EMAIL_IS_USE, WRONG_EMAIL_OR_PASSWORD } from './auth.constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { name, email, password } = registerDto;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (user && user.password) {
        throw new UnauthorizedException(EMAIL_IS_USE);
      }

      const salt = await genSalt(+process.env.SALT_VALUE);
      const newPassword = await hash(password, salt);

      if (user && !user.password) {
        const updateUser = await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            name,
            password: newPassword,
          })
          .where('id = :id', { id: user.id })
          .execute();

        return updateUser.raw[0];
      }

      return this.userRepository.save({
        name,
        email,
        password: newPassword,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(user: User): Promise<ILoginRes> {
    try {
      const tokenPayload: TokenPayload = {
        email: user.email,
        id: user.id,
        name: user.name,
      };

      return {
        tokenPayload,
        accessToken: this.jwtService.sign(tokenPayload),
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .andWhere('user.password IS NOT NULL')
        .getOne();

      if (!user) {
        throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
      }

      const isCorrectPassword = await compare(password, user.password);

      if (!isCorrectPassword) {
        throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
      }

      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
