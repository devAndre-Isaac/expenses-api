import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const emailAlreadyExists = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    const cpfAlreadyExists = await this.usersRepository.findOne({
      where: {
        cpf: createUserDto.cpf,
      },
    });
    if (cpfAlreadyExists) {
      throw new BadRequestException(`CPF: ${createUserDto.cpf} already used`);
    }
    if (emailAlreadyExists) {
      throw new BadRequestException('Email address already used');
    }

    const hashedPassword = await hash(createUserDto.password, 8);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async findAll() {
    return this.usersRepository.find({ relations: ['expenses'] });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['expenses'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('Not found this user');
    }
    const userUpdateEmail = await this.usersRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (userUpdateEmail && userUpdateEmail.id !== id) {
      throw new BadRequestException(
        'There is already one user with this email.',
      );
    }

    if (updateUserDto.password && !updateUserDto.old_password) {
      throw new BadRequestException('Old password is required.');
    }

    if (updateUserDto.password && updateUserDto.old_password) {
      const checkOldPassword = await compare(
        updateUserDto.old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException('Old password does not match.');
      }

      user.password = await hash(updateUserDto.password, 8);
    }

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;

    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }
}
