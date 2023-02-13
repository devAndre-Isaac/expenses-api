import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './controllers/expenses.controller';
import { Expenses } from './entities/expense.entity';
import { ExpensesService } from './services/expenses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expenses])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
