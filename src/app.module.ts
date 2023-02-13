import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthMiddleware from './config/middlewares/auth.middleraware';
import { UsersModule } from './modules/users/users.module';
import { dbEnv } from './config/database/config';
import { ExpensesModule } from './modules/expenses/expenses.module';

@Module({
  imports: [UsersModule, ExpensesModule, TypeOrmModule.forRoot(dbEnv)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/users',
          method: RequestMethod.POST,
        },
        {
          path: '/users/auth',
          method: RequestMethod.POST,
        },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
