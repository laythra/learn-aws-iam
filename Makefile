IMAGE ?= learnawsiam
TAG ?= latest

DOCKERFILE ?= Dockerfile
BUILD_DIR ?= dist

.PHONY: clean docker-build docker-dev

run-dev:
	docker build -t $(IMAGE):dev -f Dockerfile.dev .
	docker run --rm -it -p 5173:5173 -v $(PWD):/app -v /app/node_modules $(IMAGE):dev

build-prod:
	docker build -t $(IMAGE):$(TAG) -f $(DOCKERFILE) .

clean:
	rm -rf $(BUILD_DIR)
