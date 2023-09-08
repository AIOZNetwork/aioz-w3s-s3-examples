# File Manager HTTP API Server

The File Manager API allows you to perform basic file management operations using AWS SDK for Python [Boto3](https://pypi.org/project/boto3/). It supports uploading files, listing files, and deleting files in a specified S3 bucket. Your files are stored in AIOZ W3S Storage.

The application is developed using the Python programming language and the API is built using the [FastAPI](https://fastapi.tiangolo.com/) framework.

## ⚠ Important

* Running this code might result in charges to your AIOZ W3S account.
* Running the tests might result in charges to your AIOZ W3S account.
* We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task.
* This code is not tested in every AWS Region.

## Getting Started

To get started, you'll need to install the dependencies and start the server. Here's how:

```bash
poetry install
```

You config your environment variables in `.env` file. You can copy from `.env.example` file.

```bash
cp .env.example .env
```

Then, you can start the server by running:

```bash
poetry run uvicorn app.main:app
```

## API Documentation

## Upload a file

### Endpoint

* **POST** `/upload/`

### Request

* `file` (multipart/form-data): The file to upload.
* `file_name` (string): Desired file name (regex pattern: `^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$`).
* `return_url` (boolean, optional): Generate a signed URL for file download (default: `false`).

### Response

* **Success (HTTP 200 OK):** File uploaded successfully.

  ```json
  {
      "message": "File uploaded successfully"
  }

* **Error (HTTP 400 Bad Request):** Invalid file name format.

  ```json
  {
      "detail": "Invalid file name"
  }

## Download a file

### Endpoint

* **GET** `/download/{file_name}`

### Request

* `file_name` (string): The name of the file to download.

### Response

* **Success (HTTP 200 OK):** Returns a download URL for the requested file.

  ```json
  {
      "download_url": "<signed_url_here>"
  }
  ```

* **Error 404 (HTTP 404 Not Found):** If the file does not exist.

  ```json
  {
      "detail": "File not found"
  }
  ```

* **Error 500 (HTTP 500 Internal Server Error):** If any other error occurs during the download process.

  ```json
  {
      "detail": "Failed to download file"
  }
  ```

## List files

### Endpoint

* **GET** `/list/`

### Request

* No request parameters required.

### Response

* **Success (HTTP 200 OK):** Returns a list of file names in the bucket.

  ```json
  {
      "files": ["file1.txt", "file2.jpg", ...]
  }
  ```

## Delete a file

### Endpoint

* **DELETE** `/delete/{file_name}`

### Request

* `file_name` (string): The name of the file to delete.

### Response

* **Success (HTTP 200 OK):** File deleted successfully.

  ```json
  {
      "message": "File deleted successfully"
  }
  ```
  
* **Error (HTTP 500 Internal Server Error):** If any error occurs during the file deletion process.

  ```json
  {
      "message": "Failed to delete file",
      "error": "Error details here"
  }
  ```
