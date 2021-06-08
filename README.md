# editor-pdf-service
PDF generation service for Libero Editor

## Getting started
To get a production dist of the service built and started run:

```
make start
```

By default the service should now be available at `http://localhost:4000`.

## Development environment

To get a development dist of the service built and started run:

```
make start_dev
```

By default the service should now be available at `http://localhost:4000` and any changes made to files within the `/dev` directory will be picked up and cause the service to restart.

## Configuration

The service can be configured through the use of environment variables. 

- `PORT` port the service is exposed on (default : 4000) 