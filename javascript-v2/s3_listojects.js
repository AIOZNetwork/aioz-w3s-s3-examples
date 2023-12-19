// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  endpoint: "s3.w3s.aioz.network",
  s3ForcePathStyle: true,
});

// Create S3 service object
const s3 = new AWS.S3();

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket: process.argv[2],
};

// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
