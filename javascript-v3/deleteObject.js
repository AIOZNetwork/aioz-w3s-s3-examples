// Get service clients module and commands using ES6 syntax.
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  endpoint: {
    protocol: "https://",
    hostname: "s3.w3s.aioz.network",
    path: "/",
  },
  forcePathStyle: true,
});

// Set the bucket parameters
export const bucketParams = { Bucket: process.argv[2], Key: process.argv[3] };
console.log("Bucket parameters", bucketParams);

export const run = async () => {
  try {
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
// Invoke run() so these examples run out of the box.
run();
