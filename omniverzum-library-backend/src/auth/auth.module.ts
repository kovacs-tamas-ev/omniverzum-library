import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/library/schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: User.name,
              schema: UserSchema
            }
          ]),
          PassportModule,      
          JwtModule.register({
            secret: 'omniverzum-jwt-key',
            signOptions: { expiresIn: '1h' }
          })      
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
