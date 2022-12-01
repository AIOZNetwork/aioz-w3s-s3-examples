from botocore.exceptions import ClientError
from s3_resource import s3_resource


def main():
    try:
        for bucket in s3_resource.buckets.all():
            print(bucket.name)
    except ClientError as e:
        print("Error", e)


if __name__ == '__main__':
    main()
