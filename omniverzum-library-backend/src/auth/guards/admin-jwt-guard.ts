import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ServerException } from "src/library/models/general/server-exception";

@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            await super.canActivate(context);
            return true;
        } catch (err) {
            console.log('admin guard catch ág');
            if (err instanceof UnauthorizedException) {
                throw new ServerException({ message: 'A kéréshez jelentkezzen be' });
            }
            throw err;
        }
    }

}