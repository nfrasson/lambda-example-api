import { sign } from "jsonwebtoken";
import { User } from "../user.entity";
import { hash } from "bcryptjs";
import { IsString, IsEmail } from "class-validator";
import { connection } from "../typerorm.connection";
import { LambdaDefaultHandler } from "../default.handler";

export const register = async (data: UserRegisterDto) => {
  const dataSource = await connection();
  const userRepository = dataSource.getRepository(User);

  const user = new User(data);
  user.userPassword = await hash(data.userPassword, 8);

  await userRepository.save(user);

  const token = await sign({ userId: user.userId }, process.env.JWT_SECRET);

  return {
    statusCode: 201,
    body: { token },
  };
};

export class UserRegisterDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  userFirstname: string;

  @IsString()
  userLastname: string;

  @IsString()
  userPassword: string;
}

export const handler = new LambdaDefaultHandler(register, UserRegisterDto)
  .handleAPIGatewayEvent;
