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

//snippet-sourcedescription:[s3_deletebucket.js demonstrates how to delete an Amazon S3 bucket.]
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

// snippet-start:[s3.JavaScript.buckets.deleteBucket]
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

// Create params for S3.deleteBucket
var bucketParams = {
  Bucket: process.argv[2],
};

// Call S3 to delete the bucket
s3.deleteBucket(bucketParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
// snippet-end:[s3.JavaScript.buckets.deleteBucket]
