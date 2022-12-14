# Minimal code examples
## NodeJs
```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  },
  endpoint: {
    url: "https://s3-beta.aioz.storage"
  },
  forcePathStyle: true,
});

const filePath = "YOUR_FILE_PATH";

// Set the bucket parameters
export const bucketParams = {
  Bucket: "YOUR_BUCKET_NAME",
  Key: path.basename(filePath),
  Body: fs.createReadStream(filePath),
};

export const run = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};

run();
```

## Python
```py
import os
import sys

import boto3
from botocore.exceptions import ClientError
from botocore.config import Config


def main():
    s3_resource = boto3.resource('s3',
                                 region_name='us-east-1',
                                 # Get the credentials from the environment variables.
                                 aws_access_key_id="YOUR_ACCESS_KEY_ID",
                                 aws_secret_access_key="YOUR_SECRET_ACCESS_KEY",
                                 endpoint_url='https://s3-beta.aioz.storage',
                                 config=Config(
                                    #  signature_version='s3',
                                     s3={'addressing_style': 'path'}
                                 )
                                 )
    # Create an Amazon S3 service resource object.
    bucket_name = "YOUR_BUCKET_NAME"
    file_path = "YOUR_FILE_PATH"

    bucket = s3_resource.Bucket(bucket_name)
    object_key = os.path.basename(file_path)
    bucket = bucket.Object(object_key)
    with open(file_path, 'rb') as data:
        try:
            result = bucket.put(Body=data)
            bucket.wait_until_exists()
            print(f"Success", result)
        except ClientError as e:
            print("Error", e)
						
if __name__ == '__main__':
    main()
```

## Go
```go
package main

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL:           "https://s3-beta.aioz.storage/",
			SigningRegion: "us-east-1",
		}, nil
	})

	credentials := aws.CredentialsProviderFunc(func(ctx context.Context) (aws.Credentials, error) {
		return aws.Credentials{
			AccessKeyID:     "YOUR_ACCESS_KEY_ID",
			SecretAccessKey: "YOUR_SECRET_ACCESS_KEY",
		}, nil
	})

	// Load config
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials),
		config.WithEndpointResolverWithOptions(resolver),
	)
	if err != nil {
		log.Fatal(err)
	}

	// Create an Amazon S3 service client
	s3Client := s3.NewFromConfig(cfg,
		func(o *s3.Options) {
			o.UsePathStyle = true
		},
	)

	filePath := "YOUR_FILE_PATH"
	// Get file name from filePath
	path := strings.Split(filePath, "/")
	fileName := path[len(path)-1]

	file, openErr := os.Open(filePath)
	if openErr != nil {
		log.Fatal(openErr)
	}
	defer file.Close()
	_, putErr := s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("YOUR_BUCKET_NAME"),
		Key:    aws.String(fileName),
		Body:   file,
	})

	if putErr != nil {
		panic(putErr)
	}

	log.Println("Successfully uploaded object")
}
```