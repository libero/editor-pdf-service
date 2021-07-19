# editor-pdf-service
PDF generation service for Libero Editor

## Getting started
To get a production dist of the service built and started run:

```
make start
```

By default the service should now be available at `http://localhost:4001`.

## Development environment

To get a development dist of the service built and started run:

```
make start_dev
```

By default the service should now be available at `http://localhost:4001` and any changes made to files within the `/dev` directory will be picked up and cause the service to restart.

When in dev mode the application relies on [`mockserver`](https://www.mock-server.com/) to provide mocked responses to external requests. These responses can be configured [here](.mockServer/initializerJson.json) to change expected behaviour.

## Configuration

The service can be configured through the use of environment variables. 

- `ARTICLE_STORE_PATH` - partial internal path for reaching the `editor-article-store`. This has the requests `articleId` param appended to it to make a HEAD request before starting generation job. (default : `http://localhost:8080/articles/`)
- `EDITOR_URL` - externally accessible URL for Libero Editor (default : `http://localhost:4000`)
- `GENERATION_START_URL` - POST request is made with relevent urlencoded form data to this URL to start the PDF generation job (default : `http://localhost:80`)
- `GENERATION_STATUS_URL` - POST request is made with relevent urlencoded form data to this URL to check status of PDF generation job (default : `http://localhost:80`)
- `GENERATION_API_KEY` - API key to be sent with start job and status requests (default : `mySuperSecretApiKey`)
- `PORT` - port the service is exposed on (default : `4001`) 

## API

### POST  `/generate/${articleId}`

Used to begin the PDF generation task and returns a `jobId` which can be used to query the tasks status.

**Path Params**: `articleId` should be the ID of an article found within the targeted `editor-article-store`

**Success Response**: 
```
  {
    "status: {
      "code": 200,
      "message": "OK"
    },
    "body": "1111-1111-1111-1111"
  }
```



**No article found error response**:
```
  {
    "status: {
      "code": 404,
      "message": "Not Found"
    }
  }
```

**Failed to start job error response**:
```
  {
    "status: {
      "code": 500,
      "message": "Internal Error"
    }
  }
```

### GET  `/status/${jobId}`

Used to check the status of a PDF generation task and returns a status reference

**Path Params**: `jobId` should be the ID returned from the `POST /generate/${articleId}` request.

**Success Response**: 
```
  {
    "status: {
      "code": 200,
      "message": "OK"
    },
    "body": "complete"
  }
```

Possible status options are:

- `"YTS"` - yet to start 
- `"in-progress"` - the request is in progress
- `"completed"` - request was completed with the expected result 
- `"failed"` - request task failed 


**Get status error response**:
```
  {
    "status: {
      "code": 500,
      "message": "Internal Error"
    }
  }
```
