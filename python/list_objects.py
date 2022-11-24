import sys

from botocore.exceptions import ClientError

from s3_resource import s3_resource


def main():
    # Create an Amazon S3 service resource object.
    bucket_name = sys.argv[1]

    try:
        bucket = s3_resource.Bucket(bucket_name)
        objects = bucket.objects.all()
        for obj in objects:
            print(obj.key)
    except ClientError:
        print("Couldn't list objects from bucket '%s'.", bucket_name)


if __name__ == '__main__':
    main()
