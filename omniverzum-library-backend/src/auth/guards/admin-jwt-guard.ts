import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ServerException } from "src/library/models/general/server-exception";
import { ErrorNature } from "src/library/models/general/server-response.dto";

@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            await super.canActivate(context);
            return true;
        } catch (err) {
            if (err instanceof UnauthorizedException) {
                throw new ServerException({ message: 'A kéréshez jelentkezzen be', nature: ErrorNature.LOGIN });
            }
            throw err;
        }
    }

}