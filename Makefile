.PHONY: build start start_dev

IMAGE_TAG ?= local

build:
	docker-compose build editor-pdf-service

start:
	RUN_ENV=prod ${MAKE} build
	docker-compose up -d

start_dev:
	RUN_ENV=dev ${MAKE} build
	docker-compose up -d
