.PHONY: build start start_dev

IMAGE_TAG ?= local

build:
	docker build --no-cache -t editor-pdf-service:${IMAGE_TAG} .

start:
	npm run build
	npm start

start_dev:
	npm run dev
