import os
import sys

import boto3
from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    # Create an Amazon S3 service resource object.
    bucket_name = sys.argv[1]
    file_path = sys.argv[2]

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
