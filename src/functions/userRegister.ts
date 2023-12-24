import { LambdaDefaultHandler } from "../default.handler";
import { IsString, IsEmail } from "class-validator";
import { User } from "../user.entity";
import { connection } from "../typerorm.connection";

export const register = async (data: UserRegisterDto) => {
  const dataSource = await connection();
  const userRepository = dataSource.getRepository(User);

  const user = new User(data);

  await userRepository.save(user);

  return {
    statusCode: 201,
    body: { data, user },
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
