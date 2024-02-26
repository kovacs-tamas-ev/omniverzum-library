import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ServerException } from "src/library/models/general/server-exception";

@Injectable()
export class BasicJwtGuard extends AuthGuard('jwt') {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            await super.canActivate(context);
            return true;
        } catch (err) {
            if (err instanceof UnauthorizedException) {
                throw new ServerException({ message: 'A kéréshez jelentkezzen be' });
            }
            throw err;
        }
    }

}