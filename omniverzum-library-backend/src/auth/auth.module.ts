import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/library/schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecretOrKey } from './constants';
import { BasicJwtStrategy } from './strategies/basic-jwt.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt-strategy';
import { BasicJwtGuard } from './guards/basic-jwt.guard';
import { AdminJwtGuard } from './guards/admin-jwt-guard';

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
            secret: jwtSecretOrKey,
            signOptions: { expiresIn: '1h' }
          })      
    ],
    controllers: [AuthController],
    providers: [AuthService, BasicJwtStrategy, AdminJwtStrategy, BasicJwtGuard, AdminJwtGuard],
    exports: [BasicJwtGuard, AdminJwtGuard]
})
export class AuthModule {}
