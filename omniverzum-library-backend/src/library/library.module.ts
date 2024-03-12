import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServerExceptionFilter } from './exception-filters/server-exception.filter';
import { ServerResponseInterceptor } from './interceptors/server-response.interceptor';
import { Book, BookSchema } from './schemas/book.schema';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controller';
import { BookEvent, BookEventSchema } from './schemas/book-event.schema';
import { BookEventController } from './controllers/book-event.controller';
import { BookEventService } from './services/book-event.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: User.name,
              schema: UserSchema
            },
            {
              name: Book.name,
              schema: BookSchema
            },
            {
              name: BookEvent.name,
              schema: BookEventSchema
            }
          ]),      
        AuthModule
    ],
    providers: [
      UserService,
      BookService,
      BookEventService,
      {
        provide: APP_FILTER,
        useClass: ServerExceptionFilter,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: ServerResponseInterceptor
      }
    ],
    controllers: [UserController, BookController, BookEventController]
})
export class LibraryModule {}
