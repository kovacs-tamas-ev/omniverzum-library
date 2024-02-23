import { Module } from '@nestjs/common';
import { LibraryModule } from './library/library.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://omniverzum:vagyokakivagyok@localhost:27017/omniverzum-library'),
    LibraryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
