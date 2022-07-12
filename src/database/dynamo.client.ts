import AWS from "aws-sdk";

export class DynamoClient {
  public static getInstance() {
    return new AWS.DynamoDB.DocumentClient();
  }
}
