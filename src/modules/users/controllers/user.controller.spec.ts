import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

describe('Suite tests for Users Controller', () => {
  let app;
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = moduleRef.get<UsersController>(UsersController);
    service = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    app.close();
  });

  it('[SMOKE TEST]should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /user', () => {
    it('should pass the create validation and call the service', async () => {
      const createUser = {
        name: 'andre',
        password: '1234567',
        cpf: '12345',
        email: 'a@a.com.br',
        telephoneNumber: '12345',
      };

      const createServiceSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(createUser as any);

      const res = await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(201);

      expect(createServiceSpy).toHaveBeenNthCalledWith(1, createUser);
      expect(res.body).toEqual(createUser);
    });

    it('should throw bad request for empty body', async () => {
      service.create = jest.fn();

      await request(app.getHttpServer()).post('/users').send({}).expect(400);

      expect(service.create).toHaveBeenCalledTimes(0);
    });
  });
  describe('GET /user/:id', () => {
    it('should pass the findOne validations and call the service', async () => {
      const id = '1234567';

      const mockedRes = {
        id: '8bb50dd5-ed28-4156-9019-aec47d3f084a',
        name: 'name',
        email: 'mail@mail.com.br',
        password: '3443',
        cpf: '124321412',
        telephoneNumber: '21848124',
        created_at: '2022-09-19T21:08:17.264Z',
        updated_at: '2022-09-19T21:08:17.264Z',
      };

      const findOneServiceSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockedRes as any);

      const res = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .send()
        .expect(200);

      expect(findOneServiceSpy).toHaveBeenNthCalledWith(1, id);
      expect(res.body).toEqual(mockedRes);
    });
  });

  describe('GET /user/', () => {
    it('should pass the findAll validations and call the service', async () => {
      const mockedRes = [
        {
          id: '8bb50dd5-ed28-4156-9019-aec47d3f084a',
          name: 'yourname',
          email: 'mail@mail.com.br',
          password: '123',
          cpf: '124321412',
          telephoneNumber: '21848124',
          created_at: '2022-09-19T21:08:17.264Z',
          updated_at: '2022-09-19T21:08:17.264Z',
        },
      ];

      const findOneServiceSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(mockedRes as any);

      const res = await request(app.getHttpServer())
        .get(`/users/`)
        .send()
        .expect(200);

      expect(findOneServiceSpy).toHaveBeenNthCalledWith(1);
      expect(res.body).toEqual(mockedRes);
    });
  });

  describe('PUT /user/:id', () => {
    it('should pass the update validations and call the service', async () => {
      const id = '123';

      const mockedRes = {
        id: '842ebab1-fa33-42fd-8a57-470776dee833',
        name: 'André Isaac Ferreira',
        email: 'teste@gmail.com',
        cpf: '1111111111',
        telephoneNumber: '11111111111',
        created_at: '2022-09-25T04:46:34.285Z',
        updated_at: '2022-09-25T04:48:15.596Z',
      };

      const req = {
        name: 'André Isaac Ferreira',
        password: '211212',
        old_password: '2112',
        cpf: '1111111112',
        email: 'devandreisaac@gmail.com',
        telephoneNumber: '3199999999',
      };
      const updateServiceSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockedRes as any);

      const res = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send(req)
        .expect(200);

      expect(updateServiceSpy).toHaveBeenNthCalledWith(1, id, req);
      expect(res.body).toEqual(mockedRes);
    });
  });
  describe('DELETE /user/:id', () => {
    it('should pass the delete validations and call the service', async () => {
      const id = '123';

      const deleteServiceSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValue('' as any);

      const res = await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .send()
        .expect(200);

      expect(deleteServiceSpy).toHaveBeenNthCalledWith(1, id);
      expect(res.body).toEqual({});
    });
  });
});
