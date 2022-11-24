import os

import boto3
from botocore.config import Config

s3_resource = boto3.resource('s3',
                             region_name='us-east-1',
                             # Get the credentials from the environment variables.
                             aws_access_key_id=os.environ['ACCESS_KEY'],
                             aws_secret_access_key=os.environ['SECRET_KEY'],
                             endpoint_url='https://s3-beta.aioz.storage',
                            #  config=Config(
                            #      signature_version='s3',
                            #      s3={'addressing_style': 'path'}
                            #  )
                             )
