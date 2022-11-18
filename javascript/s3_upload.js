/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

//snippet-sourcedescription:[s3_upload.js demonstrates how to upload an arbitrarily-sized stream to an Amazon S3 bucket.]
//snippet-service:[s3]
//snippet-keyword:[JavaScript]
//snippet-sourcesyntax:[javascript]
//snippet-keyword:[Code Sample]
//snippet-keyword:[Amazon S3]
//snippet-sourcetype:[full-example]
//snippet-sourcedate:[2018-06-02]
//snippet-sourceauthor:[AWS-JSDG]

// ABOUT THIS NODE.JS SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

// snippet-start:[s3.JavaScript.buckets.upload]
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
var fs = require("fs");
var path = require("path");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  endpoint: "s3-beta.aioz.storage",
  s3ForcePathStyle: true,
});

// Create S3 service object
const s3 = new AWS.S3();

const filePath = process.argv[3];
const fileStream = fs.createReadStream(filePath);
fileStream.on("error", function (err) {
  console.log("File Error", err);
});
const key = path.basename(filePath);
// call S3 to retrieve upload file to specified bucket
var uploadParams = {
  Bucket: process.argv[2],
  Key: key,
  Body: fileStream,
};

// call S3 to retrieve upload file to specified bucket
s3.upload(uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  }
  if (data) {
    console.log("Upload Success", data.Location);
  }
});
// snippet-end:[s3.JavaScript.buckets.upload]
