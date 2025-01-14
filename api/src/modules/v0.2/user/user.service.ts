import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user2';
  }

  findAll() {
    return `This action returns all user2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user2`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user2`;
  }

  remove(id: number) {
    return `This action removes a #${id} user2`;
  }
}