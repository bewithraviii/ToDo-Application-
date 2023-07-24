import { Controller, Post, Get, Body, Param, Query, Patch, Delete, NotFoundException, BadRequestException, UseInterceptors, UseGuards  } from '@nestjs/common';
import { UserSignUpDto } from './dtos/User-Signup.dto';
import { UserSignInDto } from './dtos/User-SignIn.dto';
import { UserDto } from './dtos/User.dto';
import { UpdateUserDto } from './dtos/User-Update.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serializeInterceptor';
import { Session } from '@nestjs/common/decorators';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger/dist';



@ApiTags('User Section')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersServices: UsersService, private authService: AuthService) {}


    @Get('/whoami')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get current userID by session' })
    @ApiResponse({
        status: 200,
        description: 'UserId by session found'
    })
    @ApiResponse({
        status: 403,
        description: 'UserId by session not found'
    })
    whoAmI(@Session() session: any)
    {
        return this.usersServices.findUserById(session.userId);
    }


    @Post('/signOut')
    @ApiOperation({ summary: 'Current User SignOut' })
    @ApiResponse({
        status: 200,
        description: 'User SignOut Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'User SignOut Failed'
    })
    signOut(@Session() session: any)
    {
        if(session.userId)
        {
            session.userId = null;
            return 'User Signed Out successfully';
        }
        else
        {
            return 'No User was logged in "SignOut Disabled"' 
        }
    }


    @Post('/signUp')
    @ApiOperation({ summary: 'Create new User' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    example: 'Ravi',
                    description: 'this is the name'
                },
                email: {
                    type: 'string',
                    example: 'ravipatel@gmail.com',
                    description: 'this is the email'
                },
                password: {
                    type: 'string',
                    example: 'zxcv1234',
                    description: 'this is the password'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'User Created successfully'
    })
    @ApiResponse({
        status: 403,
        description: 'User Not Created'
    })
    async userSignUp(@Body() body: UserSignUpDto, @Session() session: any)
    {
        const userSignUp = await this.authService.signup(body.name, body.email, body.password);
        session.userId = userSignUp.id;
        return userSignUp;
    }


    @Post('/signIn')
    @ApiOperation({ summary: 'User Signin' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'ravipatel@gmail.com',
                    description: 'this is the email'
                },
                password: {
                    type: 'string',
                    example: 'zxcv1234',
                    description: 'this is the password'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'User Signin successfully'
    })
    @ApiResponse({
        status: 403,
        description: 'User Signin Failed'
    })
    async userSignIn(@Body() body: UserSignInDto, @Session() session: any)
    {
        const userSignIp = await this.authService.signin(body.email, body.password);
        session.userId = userSignIp.id;
        return userSignIp;
    }





    // Find User with email
    @Get()
    @ApiOperation({ summary: 'Find User with query email' })
    @ApiResponse({
        status: 200,
        description: 'Data for this User is Fetched'
    })
    @ApiResponse({
        status: 403,
        description: 'Data with this User not found'
    })
    async userwithemailQuery(@Query('email') email: string)
    {
        const user = await this.usersServices.findUserByEmail(email);
        if(!user)
        {
            throw new NotFoundException('User Not Found');
        }

        return user;

    }

    // Find User with email
    @Get('/:email')
    @ApiOperation({ summary: 'Find User with email' })
    @ApiParam({
        name: 'email',
        type: 'string',
        description: 'enter email for finding user',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Data for this User is Fetched'
    })
    @ApiResponse({
        status: 403,
        description: 'Data with this User not found'
    })
    async userwithemail(@Param('email') email: string)
    {
        const user = await this.usersServices.findUserByEmail(email);
        if(!user)
        {
            throw new NotFoundException('User Not Found');
        }

        return user;

    }
    


    // Update User
    @Patch('/:id')
    @ApiOperation({ summary: 'Update the user with ID' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter UserId for update',
        required: true
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    example: 'Ravi',
                    description: 'this is the name'
                },
                email: {
                    type: 'string',
                    example: 'ravipatel@gmail.com',
                    description: 'this is the email'
                },
                password: {
                    type: 'string',
                    example: 'zxcv1234',
                    description: 'this is the password'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'User Updated Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'User Not Updated'
    })
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto)
    {
        return this.usersServices.updateUser(parseInt(id), body);
    }


    // Delete User
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete this User' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter UserID for Delete',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'User Deleted Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'User Not Deleted'
    })
    async removeUser(@Param('id') id: string)
    {
        return this.usersServices.deleteUser(parseInt(id));
    }



    // Find User with id
    // @Get('/:id')
    // async fetchUser(@Param('id') id: string)
    // {
    //     return this.usersServices.findUserById(parseInt(id));
    // }


  

}
