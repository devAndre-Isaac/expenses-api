import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from '../services/expenses.service';

describe('Suite tests for Expenses Controller', () => {
  let app;
  let controller: ExpensesController;
  let service: ExpensesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = moduleRef.get<ExpensesController>(ExpensesController);
    service = moduleRef.get<ExpensesService>(ExpensesService);
  });

  afterAll(async () => {
    app.close();
  });

  it('[SMOKE TEST]should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /expenses', () => {
    it('should call the create method of expensesService with the provided data', async () => {
      const createExpenseDto = {
        description: 'Despesa',
        date: '2023-02-12',
        value: 550,
        userId: 'de6bd254-ec9b-4899-8b5a-5d9cc41a4a18',
      };

      const createdExpense = {
        id: 'f74d9c07-8230-4f91-937f-34be288ae66f',
        ...createExpenseDto,
      };

      const expensesService = {
        create: jest.fn().mockResolvedValue(createdExpense),
      };

      const controller = new ExpensesController(expensesService as any);

      const result = await controller.create(createExpenseDto as any);

      expect(expensesService.create).toHaveBeenCalledTimes(1);
      expect(expensesService.create).toHaveBeenCalledWith(createExpenseDto);
      expect(result).toEqual(createdExpense);
    });

    it('should throw bad request for empty body', async () => {
      service.create = jest.fn();

      await request(app.getHttpServer()).post('/expenses').send({}).expect(400);

      expect(service.create).toHaveBeenCalledTimes(0);
    });
  });
  describe('GET /expenses/:id', () => {
    it('should pass the findOne validations and call the service', async () => {
      const id = '1234567';

      const mockedRes = {
        id: '8bb50dd5-ed28-4156-9019-aec47d3f084a',
        description: 'Despesa',
        date: '2023-02-12T02:30:00.000Z',
        value: 20,
        user: 'de6bd254-ec9b-4899-8b5a-5d9cc41a4a18',
        created_at: '2022-09-19T21:08:17.264Z',
        updated_at: '2022-09-19T21:08:17.264Z',
      };

      const findOneServiceSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockedRes as any);

      const res = await request(app.getHttpServer())
        .get(`/expenses/${id}`)
        .send()
        .expect(200);

      expect(findOneServiceSpy).toHaveBeenNthCalledWith(1, id);
      expect(res.body).toEqual(mockedRes);
    });
  });

  describe('GET /expenses/', () => {
    it('should pass the findAll validations and call the service', async () => {
      const mockedRes = [
        {
          id: '8bb50dd5-ed28-4156-9019-aec47d3f084a',
          description: 'Despesa',
          date: '2023-02-12T02:30:00.000Z',
          value: 20,
          user: 'de6bd254-ec9b-4899-8b5a-5d9cc41a4a18',
          created_at: '2022-09-19T21:08:17.264Z',
          updated_at: '2022-09-19T21:08:17.264Z',
        },
      ];

      const findOneServiceSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(mockedRes as any);

      const res = await request(app.getHttpServer())
        .get(`/expenses/`)
        .send()
        .expect(200);

      expect(findOneServiceSpy).toHaveBeenNthCalledWith(1);
      expect(res.body).toEqual(mockedRes);
    });
  });

  describe('PUT /expenses/:id', () => {
    it('should call the update method of expensesService with the provided data', async () => {
      const id = 'f74d9c07-8230-4f91-937f-34be288ae66f';

      const updateExpenseDto = {
        description: 'Nova descrição',
        date: '2023-02-14',
        value: 30,
        userId: 'de6bd254-ec9b-4899-8b5a-5d9cc41a4a18',
      };

      const updatedExpense = {
        id,
        ...updateExpenseDto,
      };

      const expensesService = {
        update: jest.fn().mockResolvedValue(updatedExpense),
      };

      const controller = new ExpensesController(expensesService as any);

      const result = await controller.update(id, updateExpenseDto as any);

      expect(expensesService.update).toHaveBeenCalledTimes(1);
      expect(expensesService.update).toHaveBeenCalledWith(id, updateExpenseDto);
      expect(result).toEqual(updatedExpense);
    });
  });
  describe('DELETE /expenses/:id', () => {
    it('should pass the delete validations and call the service', async () => {
      const id = '123';

      const deleteServiceSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValue('' as any);

      const res = await request(app.getHttpServer())
        .delete(`/expenses/${id}`)
        .send()
        .expect(200);

      expect(deleteServiceSpy).toHaveBeenNthCalledWith(1, id);
      expect(res.body).toEqual({});
    });
  });
});
