import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRpository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.userRpository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (user) {
      throw new UnauthorizedException('Email is already in use');
    }

    const salt = await genSalt(10);
    const newUser = new User();
    newUser.email = email;
    newUser.password = await hash(password, salt);

    return this.userRpository.save(newUser);
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userRpository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('User not found or wrong password');
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Wrong Password');
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email };

    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
