import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { concatenateData } from "./utils/concatenate-data.util";
import { returnHandler } from "./utils/return-handler.util";

type APIFunction = (data: any) => Promise<APIGatewayProxyResultV2>;

export class LambdaDefaultHandler {
  private handler: APIFunction;
  private entity?: any;
  private connectToDatabase?: () => Promise<any>;

  constructor(
    handler: APIFunction,
    entity: any,
    connectToDatabase?: () => Promise<any>
  ) {
    this.handler = handler;
    this.entity = entity;
    this.connectToDatabase = connectToDatabase;

    this.handleAPIGatewayEvent = this.handleAPIGatewayEvent.bind(this);
  }

  public async handleAPIGatewayEvent(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResultV2> {
    try {
      if (this.connectToDatabase) {
        await this.connectToDatabase();
      }

      if (event.headers?.["x-iswarmup"]) {
        console.log("WarmUp - Lambda is warm!");
        return returnHandler({ statusCode: 204 });
      }

      const userObject: object = plainToInstance(
        this.entity,
        concatenateData(event)
      );

      console.log("userObject", userObject);
      const errors = await validate(userObject);

      if (errors.length > 0) throw new Error("Validation failed");

      const { statusCode, body } = await this.handler(
        userObject as typeof this.entity
      );

      return returnHandler({ body, statusCode });
    } catch (error) {
      console.error("Error handling API Gateway event:", error);
      return returnHandler({ body: error, statusCode: 500 });
    }
  }
}
