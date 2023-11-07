import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException("No authorization token provided");
    }

    try {
      const token = authorization.replace("Bearer ", "");
      console.log("token", token);
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("decodedToken", decodedToken);
      req["user"] = decodedToken;
      next();
    } catch (error) {
      throw new UnauthorizedException("Invalid ID token");
    }
  }
}
