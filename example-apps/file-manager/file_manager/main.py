import os
import re

import boto3
import botocore
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile

load_dotenv()

app = FastAPI()

# Initialize AWS S3 client
s3_resource = boto3.resource(
    "s3",
    region_name="us-east-1",
    # Get the credentials from the environment variables.
    aws_access_key_id=os.environ["ACCESS_KEY"],
    aws_secret_access_key=os.environ["SECRET_KEY"],
    endpoint_url=os.environ["ENDPOINT_URL"],
)
bucket_name = "file-manager"
bucket = s3_resource.Bucket(bucket_name)
EXPIRATION_TIME = 600


@app.post("/upload/")
async def upload_file(file: UploadFile, file_name: str, return_url: bool = False):
    # Validate the file name to prevent security vulnerabilities
    if not re.match(r"^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$", file_name):
        raise HTTPException(status_code=400, detail="Invalid file name")

    # Upload the file to the specified bucket
    obj = bucket.Object(file_name)
    obj.put(Body=file.file)

    if return_url:
        # Generate a signed URL for downloading the file (if necessary)
        presigned_url = s3_resource.meta.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": file_name},
            ExpiresIn=EXPIRATION_TIME,
        )
        return {"message": "File uploaded successfully", "file_url": presigned_url}
    return {"message": "File uploaded successfully"}


@app.get("/download/{file_name}")
async def download_file(file_name: str):
    try:
        # Check if the file exists in the specified bucket
        obj = s3_resource.Object(bucket_name, file_name)
        obj.load()

        # Generate a signed URL for downloading the file (if necessary)
        # You may not need this step if your storage provider allows public access.
        presigned_url = s3_resource.meta.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": file_name},
            ExpiresIn=EXPIRATION_TIME,
        )

        return {"download_url": presigned_url}
    except botocore.exceptions.ClientError as e:
        # If the file does not exist, return a 404 error to the client
        if e.response["Error"]["Code"] == "404":
            raise HTTPException(status_code=404, detail="File not found")
        # Otherwise, return a generic error message to the client with a status code of 500
        raise HTTPException(status_code=500, detail="Failed to download file")


@app.get("/list/")
async def list_files():
    files = [file.key for file in bucket.objects.all()]
    return {"files": files}


@app.delete("/delete/{file_name}")
async def delete_file(file_name: str):
    # Delete the specified object from the bucket
    try:
        obj = bucket.Object(file_name)
        obj.delete()
    except Exception as e:
        return {"message": "Failed to delete file", "error": str(e)}

    return {"message": "File deleted successfully"}
