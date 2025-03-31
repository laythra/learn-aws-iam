IMAGE ?= learnawsiam
TAG ?= latest

DOCKERFILE ?= Dockerfile
BUILD_DIR ?= dist

.PHONY: build clean docker-build

build:
	yarn install
	yarn build

clean:
	rm -rf $(BUILD_DIR)

docker-build: build
	docker build -t $(IMAGE):$(TAG) -f $(DOCKERFILE) .
