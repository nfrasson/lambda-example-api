import { APIGatewayProxyEvent } from "aws-lambda";

export function concatenateData(event: APIGatewayProxyEvent) {
  return {
    ...(event.body && JSON.parse(event.body)),
    ...event.queryStringParameters,
    ...event.pathParameters,
  };
}
