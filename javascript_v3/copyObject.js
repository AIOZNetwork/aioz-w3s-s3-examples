// Get service clients module and commands using ES6 syntax.
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";

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
export const params = {
  Bucket: process.argv[2],
  CopySource: process.argv[3],
  Key: process.argv[4],
};

// Create the Amazon S3 bucket.
export const run = async () => {
  try {
    const data = await s3Client.send(new CopyObjectCommand(params));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
// Invoke run() so these examples run out of the box.
run();
