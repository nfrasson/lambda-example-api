import { APIGatewayProxyResultV2 } from "aws-lambda";

export function returnHandler(input: {
  statusCode?: number;
  body?: object;
}): APIGatewayProxyResultV2 {
  return {
    statusCode: input?.statusCode || 200,
    body: JSON.stringify(input?.body || {}),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
}
