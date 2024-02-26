import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServerExceptionFilter } from './exception-filters/server-exception.filter';
import { ServerResponseInterceptor } from './interceptors/server-response.interceptor';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: User.name,
              schema: UserSchema
            }
          ]),      
        AuthModule
    ],
    providers: [
      UserService,
      {
        provide: APP_FILTER,
        useClass: ServerExceptionFilter,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: ServerResponseInterceptor
      }
    ],
    controllers: [UserController]
})
export class LibraryModule {}
