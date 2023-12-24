import { DataSource } from "typeorm";
import { User } from "./user.entity";

let dataSource: DataSource;

export const connection = async () => {
  if (!dataSource?.isInitialized) {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: "lambda_api_example",
      entities: [User],
      ssl: true,
      logging: true,
      synchronize: true,
    });

    await dataSource.initialize();
  }

  return dataSource;
};
