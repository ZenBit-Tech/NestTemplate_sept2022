import { Controller, Patch, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailDto } from 'modules/user/dto/login-user.dto';
import { RecoverPasswordDto } from 'modules/user/dto/recover-password.dto';
import { UserService } from 'modules/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('recover-password')
  sendToken(@Body() userEmail: EmailDto): Promise<{ message: string }> {
    return this.userService.sendToken(userEmail);
  }

  @Post('recover-password')
  recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.recoverPassword(recoverPasswordDto);
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }
}
