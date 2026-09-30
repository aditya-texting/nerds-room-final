import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return db.orm.public.User.where({ email }).first();
  }

  async findById(id: string) {
    return db.orm.public.User.where({ id }).first();
  }

  async create(data: any) {
    return db.orm.public.User.create(data);
  }

  async update(id: string, data: any) {
    return db.orm.public.User.where({ id }).update(data);
  }
}
