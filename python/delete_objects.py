import os
import sys

from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    bucket_name = sys.argv[1]
    object_keys = [sys.argv[2], sys.argv[3]]

    bucket = s3_resource.Bucket(bucket_name)
    try:
        response = bucket.delete_objects(Delete={
            'Objects': [{
                'Key': key
            } for key in object_keys]
        })
        print("response", response)
        if 'Deleted' in response:
            print("Success")
            # print(
            #     "Deleted objects '%s' from bucket '%s'.",
            #     [del_obj['Key'] for del_obj in response['Deleted']], bucket.name)
        if 'Errors' in response:
            print(
                "Could not delete objects '%s' from bucket '%s'.", [
                    f"{del_obj['Key']}: {del_obj['Code']}"
                    for del_obj in response['Errors']],
                bucket.name)
    except ClientError as e:
        print("Error", e)


if __name__ == '__main__':
    main()
