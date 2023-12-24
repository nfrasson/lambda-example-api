import { LambdaDefaultHandler } from "../default.handler";
import { IsString, IsEmail } from "class-validator";

export const login = async (data: UserLoginDto) => {
  return {
    statusCode: 200,
    body: data,
  };
};

export class UserLoginDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  userPassword: string;
}

export const handler = new LambdaDefaultHandler(login, UserLoginDto).handleAPIGatewayEvent;
