import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { numberFormat } from '../../../utils/formatter';
import { getRepository, Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { Expenses } from '../entities/expense.entity';
import { mail } from '../../../config/mail/EtherealMail';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private readonly expensesRepository: Repository<Expenses>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({
      where: { id: createExpenseDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const formatValue = numberFormat(createExpenseDto.value);

    const expense = this.expensesRepository.create({
      date: createExpenseDto.date,
      description: createExpenseDto.description,
      user: createExpenseDto.userId,
      value: formatValue,
    } as any);

    await this.expensesRepository.save(expense);
    try {
      await mail.send({
        to: user.email,
        from: '',
        description: createExpenseDto.description,
        value: formatValue,
        userName: user.name,
      });
      return { ...expense, sendMail: true };
    } catch (err) {
      return { ...expense, sendMail: false, errMessage: err.message };
    }
  }

  async findAll() {
    return await this.expensesRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const expense = await this.expensesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
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
      value: numberFormat(updateExpenseDto.value),
    });
  }

  async remove(id: string) {
    const expense = await this.expensesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!expense) {
      throw new NotFoundException('Not found this expense');
    }
    await this.expensesRepository.remove(expense);
  }
}
