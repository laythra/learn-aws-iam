-include .env
export

IMAGE ?= learn-aws-iam
TAG ?= latest
REGISTRY ?=
PLATFORM ?= linux/amd64
VITE_ANALYTICS_URL ?= http://localhost:3000/analytics

DOCKERFILE ?= Dockerfile
BUILD_DIR ?= dist

IMAGE_FULL = $(if $(REGISTRY),$(REGISTRY)/$(IMAGE),$(IMAGE))

.PHONY: clean build-prod run-dev run-prod push-prod help

run-dev:
		docker build -t $(IMAGE):dev -f Dockerfile.dev .
		docker run --rm -p 5173:5173 -v $(PWD):/app -v /app/node_modules $(IMAGE):dev

build-prod:
		docker build \
			--platform=$(PLATFORM) \
			-t $(IMAGE_FULL):$(TAG) \
			--build-arg VITE_APP_ENV=production \
			--build-arg VITE_ANALYTICS_URL="$(VITE_ANALYTICS_URL)" \
			-f $(DOCKERFILE) .

run-prod:
		docker run --rm \
			--platform=$(PLATFORM) \
			-p 8080:80 \
			$(IMAGE_FULL):$(TAG)

push-prod: build-prod
		@if [ -z "$(REGISTRY)" ]; then \
				echo "Error: REGISTRY not set. Usage: make push-prod REGISTRY=your-username"; \
				exit 1; \
		fi
		docker push $(IMAGE_FULL):$(TAG)

clean:
		rm -rf $(BUILD_DIR)

help:
	@echo "Targets:"
	@echo "  run-dev     Run dev server in Docker"
	@echo "  build-prod  Build production image"
	@echo "  run-prod    Run production image locally"
	@echo "  push-prod   Push image (REGISTRY required)"
