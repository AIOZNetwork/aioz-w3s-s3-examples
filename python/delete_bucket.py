import os
import sys

from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    bucket_name = sys.argv[1]

    bucket = s3_resource.Bucket(bucket_name)
    try:
        bucket.delete()
        bucket.wait_until_not_exists()
        print("Success")
    except ClientError as e:
        print("Error", e)


if __name__ == '__main__':
    main()
