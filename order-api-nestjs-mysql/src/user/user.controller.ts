import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}
  
    @Get()
    findAll(): Promise<Users[]> {
      return this.userService.findAll()
    }
  
    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<Users> {
      return this.userService.findOne(id);
    }
  
    @Post()
    create(@Body() user: Users) {
      return this.userService.create(user);
    }
  
    @Put()
    updatePassword(@Body() users: Users) {
      return this.userService.updatePassword(users);
    }
  
    @Delete(':id')
    deleteUser(@Param('id') id: number) {
      return this.userService.delete(id);
    }
}
