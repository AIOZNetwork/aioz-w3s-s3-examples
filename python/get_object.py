import os
import sys

from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    # Create an Amazon S3 service resource object.
    bucket_name = sys.argv[1]
    file_path = sys.argv[2]
    object_key = os.path.basename(file_path)

    bucket = s3_resource.Bucket(bucket_name)
    s3_object = bucket.Object(object_key)
    try:
        s3_object.get()['Body'].read()
        s3_object.wait_until_exists()
        print("Success")
    except ClientError:
        print("Couldn't get object '%s' from bucket '%s'.",
              s3_object.key, s3_object.bucket_name)


if __name__ == '__main__':
    main()
