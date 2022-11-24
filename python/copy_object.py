import os
import sys

from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    src_bucket_name = sys.argv[1]
    src_object_key = sys.argv[2]
    desk_bucket_name = sys.argv[3]
    dest_object_key = sys.argv[4]

    dest_bucket = s3_resource.Bucket(desk_bucket_name)
    dest_object = dest_bucket.Object(dest_object_key)
    try:
        dest_object.copy_from(CopySource={
            'Bucket': src_bucket_name,
            'Key': src_object_key
        })
        dest_object.wait_until_exists()
        print("Success")
    except ClientError as e:
        print("Error", e)


if __name__ == '__main__':
    main()
