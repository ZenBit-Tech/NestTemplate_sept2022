import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Work Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
  })
  @IsString()
  password: string;
}
