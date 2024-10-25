import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

const DYNAMODB_TABLE_NAME = "final-database-617323";
const BUCKET_NAME = "final-s3-images-store-617323";

export const handler = async (event) => {
  try {
    const email = event.queryStringParameters.email;

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Missing query parameter: email" }),
      };
    }

    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      KeyConditionExpression: "email = :emailValue",
      ExpressionAttributeValues: {
        ":emailValue": { S: email },
      },
    };

    const command = new QueryCommand(params);
    const data = await dynamoDB.send(command);

    const images = await Promise.all(
      data.Items.map(async (item) => {
        const getParams = {
          Bucket: BUCKET_NAME,
          Key: item.imageFileName.S,
        };
        const getObjectCommand = new GetObjectCommand(getParams);
        const url = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 60,
        });

        return {
          email: item.email.S,
          imageFileName: item.imageFileName.S,
          dateTime: item.dateTime.S,
          url: url, 
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(images),
    };
  } catch (err) {
    console.error("Unable to query item. Error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
