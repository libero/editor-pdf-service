.PHONY: build start start_dev

IMAGE_TAG ?= local

build:
	IMAGE_TAG=${IMAGE_TAG} docker-compose build editor-pdf-service

start:
	RUN_ENV=prod ${MAKE} build
	IMAGE_TAG=${IMAGE_TAG} docker-compose up -d

start_dev:
	RUN_ENV=dev ${MAKE} build
	IMAGE_TAG=${IMAGE_TAG} docker-compose up -d
