import { Controller, Post, Body } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth')
  create(@Body() authUserDto: AuthUserDto) {
    return this.authService.auth(authUserDto);
  }
}
