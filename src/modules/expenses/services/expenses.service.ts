import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { numberFormat } from 'src/utils/formatter';
import { getRepository, Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { Expenses } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private readonly expensesRepository: Repository<Expenses>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const user = await getRepository(User).findOne({
      where: { id: createExpenseDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const formatValue = numberFormat(createExpenseDto.value);
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      value: formatValue,
    });

    await this.expensesRepository.save(expense);

    return expense;
  }

  async findAll() {
    return await this.expensesRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const user = await this.expensesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expensesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!expense) {
      throw new NotFoundException('Not found this expense');
    }

    return await this.expensesRepository.save({
      ...expense,
      ...updateExpenseDto,
    } as any);
  }

  remove(id: string) {
    return `This action removes a #${id} expense`;
  }
}
