import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://omniverzum:vagyokakivagyok@localhost:27017/omniverzum-library')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
