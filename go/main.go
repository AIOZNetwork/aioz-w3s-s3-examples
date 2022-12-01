package main

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func createBucket(s3Client *s3.Client, bucketName string) {
	_, err := s3Client.CreateBucket(context.TODO(), &s3.CreateBucketInput{
		Bucket: aws.String(bucketName),
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully created bucket", bucketName)
}

func listBuckets(s3Client *s3.Client) {
	listBucketsResult, err := s3Client.ListBuckets(context.TODO(), &s3.ListBucketsInput{})

	if err != nil {
		panic(err)
	}

	for _, bucket := range listBucketsResult.Buckets {
		log.Printf("Bucket name: %s\t\tcreated at: %v\n", *bucket.Name, bucket.CreationDate)
	}
}

func listObjects(s3Client *s3.Client, bucketName string) {
	listObjectsResult, err := s3Client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String(bucketName),
	})

	if err != nil {
		panic(err)
	}

	for _, object := range listObjectsResult.Contents {
		log.Printf("key=%s size=%d", aws.ToString(object.Key), object.Size)
	}
}

func putObject(s3Client *s3.Client, bucketName string, filePath string) {
	// Get file name from filePath
	path := strings.Split(filePath, "/")
	fileName := path[len(path)-1]

	file, openErr := os.Open(filePath)
	if openErr != nil {
		log.Fatal(openErr)
	}
	defer file.Close()
	_, err := s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   file,
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully uploaded object to bucket", bucketName, "with key", fileName)
}

func getObject(s3Client *s3.Client, bucketName string, objectKey string) {
	getObjectResult, err := s3Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully got object from bucket", bucketName, "with key", objectKey)
	log.Println("Object content:", getObjectResult.Body)
}

func deleteObject(s3Client *s3.Client, bucketName string, objectKey string) {
	_, err := s3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully deleted object from bucket", bucketName, "with key", objectKey)
}

func deleteBucket(s3Client *s3.Client, bucketName string) {
	_, err := s3Client.DeleteBucket(context.TODO(), &s3.DeleteBucketInput{
		Bucket: aws.String(bucketName),
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully deleted bucket", bucketName)
}

func deleteMultiObjects(s3Client *s3.Client, bucketName string, objectKeys []string) {
	_, err := s3Client.DeleteObjects(context.TODO(), &s3.DeleteObjectsInput{
		Bucket: aws.String(bucketName),
		Delete: &types.Delete{
			Objects: []types.ObjectIdentifier{
				{
					Key: aws.String(objectKeys[0]),
				},
				{
					Key: aws.String(objectKeys[1]),
				},
			},
		},
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully deleted objects from bucket", bucketName, "with keys", objectKeys)
}

func copyObject(s3Client *s3.Client, sourceBucketName string, objectKey string, destinationBucketName string) {
	_, err := s3Client.CopyObject(context.TODO(), &s3.CopyObjectInput{
		Bucket:     aws.String(destinationBucketName),
		Key:        aws.String(objectKey),
		CopySource: aws.String(sourceBucketName + "/" + objectKey),
	})

	if err != nil {
		panic(err)
	}

	log.Println("Successfully copied object from bucket", sourceBucketName, "with key", objectKey, "to bucket", destinationBucketName, "with key", objectKey)
}

func main() {

	resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL:           "https://s3-beta.aioz.storage/",
			SigningRegion: "us-east-1",
		}, nil
	})

	credentials := aws.CredentialsProviderFunc(func(ctx context.Context) (aws.Credentials, error) {
		return aws.Credentials{
			AccessKeyID:     os.Getenv("ACCESS_KEY"),
			SecretAccessKey: os.Getenv("SECRET_KEY"),
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

	// If you want to try any of the functions, uncomment the function you want to try
	listBuckets(s3Client)
	// createBucket(s3Client, os.Args[1])
	// listObjects(s3Client, os.Args[1])
	// putObject(s3Client, os.Args[1], os.Args[2])
	// getObject(s3Client, os.Args[1], os.Args[2])
	// deleteObject(s3Client, os.Args[1], os.Args[2])
	// deleteBucket(s3Client, os.Args[1])
	// deleteMultiObjects(s3Client, os.Args[1], []string{os.Args[2], os.Args[3]})
	// copyObject(s3Client, os.Args[1], os.Args[2], os.Args[3])
}
