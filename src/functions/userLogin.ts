import { sign } from "jsonwebtoken";
import { User } from "../user.entity";
import { LambdaDefaultHandler } from "../default.handler";
import { connection } from "../typerorm.connection";
import { compare } from "bcryptjs";
import { IsString, IsEmail } from "class-validator";

export const login = async (data: UserLoginDto) => {
  const dataSource = await connection();
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { userEmail: data.userEmail },
  });

  if (!user) {
    return {
      statusCode: 404,
      body: "User not found",
    };
  }

  const valid = await compare(data.userPassword, user.userPassword);

  if (!valid) {
    return {
      statusCode: 401,
      body: "Invalid password",
    };
  }

  const token = await sign({ userId: user.userId }, process.env.JWT_SECRET);

  return {
    statusCode: 200,
    body: {token},
  };
};

export class UserLoginDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  userPassword: string;
}

export const handler = new LambdaDefaultHandler(login, UserLoginDto)
  .handleAPIGatewayEvent;
