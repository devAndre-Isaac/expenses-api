import authConfig from '../../../../config/auth';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthUserDto } from '../dto/auth-user.dto';
import { User } from '../../entities/user.entity';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async auth(authUserDto: AuthUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: authUserDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Incorrect email/password combination');
    }

    const passwordConfirmed = await compare(
      authUserDto.password,
      user.password,
    );

    if (!passwordConfirmed) {
      throw new NotFoundException('Incorrect email/password combination');
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });
    delete user.password;
    return { user, token };
  }
}
