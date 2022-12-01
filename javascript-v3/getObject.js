// Get service clients module and commands using ES6 syntax.
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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
export const bucketParams = { Bucket: process.argv[2], Key: process.argv[3] };

export const run = async () => {
  try {
    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    // Convert the ReadableStream to a string.
    return await data.Body.transformToString();
  } catch (err) {
    console.log("Error", err);
  }
};
// Invoke run() so these examples run out of the box.
run();
