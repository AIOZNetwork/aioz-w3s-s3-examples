// Get service clients module and commands using ES6 syntax.
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

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

const filePath = process.argv[3];
const fileStream = fs.createReadStream(filePath);
fileStream.on("error", function (err) {
  console.log("File Error", err);
});
const key = path.basename(filePath);

// Set the bucket parameters
export const bucketParams = {
  Bucket: process.argv[2],
  Key: key,
  Body: fileStream,
};

export const run = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
// Invoke run() so these examples run out of the box.
run();
