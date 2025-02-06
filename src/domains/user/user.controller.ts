// import {Body, Controller, Post} from "@nestjs/common";
// import {UserService} from "./user.service";
// import {User} from "./entites/user.entity";
//
// @Controller('v1/user')
// export class UserController {
//     constructor(
//         private readonly userService: UserService,
//     ) {}
//
//
//     @Post()
//     async create(@Body() user: User): Promise<User> {
//         const userPromise = this.userService.createUser(user);
//         return userPromise;
//     }
// }