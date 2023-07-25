import { CanActivate, ExecutionContext } from "@nestjs/common";


export class AuthGuard implements CanActivate {

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.session.userId;
        return request.session.userId;
    }

}