// Get service clients module and commands using ES6 syntax.
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  endpoint: {
    protocol: "https://",
    hostname: "s3-beta.aioz.storage",
    path: "/",
  },
  forcePathStyle: true,
});

// Set the bucket parameters
export const bucketParams = {
  Bucket: process.argv[2],
  Delete: {
    Objects: [
      {
        Key: process.argv[3],
      },
      {
        Key: process.argv[4],
      },
    ],
  },
};

export const run = async () => {
  try {
    const data = await s3Client.send(new DeleteObjectsCommand(bucketParams));
    console.log("Success. Object deleted.");
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();
