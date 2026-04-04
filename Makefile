-include .env
export

IMAGE ?= learn-aws-iam
TAG ?= latest
REGISTRY ?=
PLATFORM ?= linux/amd64,linux/arm64
VITE_ANALYTICS_URL ?= http://localhost:3000/analytics
VITE_SENTRY_DSN ?=

DOCKERFILE ?= Dockerfile
BUILD_DIR ?= dist

IMAGE_FULL = $(if $(REGISTRY),$(REGISTRY)/$(IMAGE),$(IMAGE))

.PHONY: clean build-prod run-dev run-prod push-prod help

run-dev:
		docker build -t $(IMAGE):dev -f Dockerfile.dev .
		docker run --rm -p 5173:5173 -v $(PWD):/app -v /app/node_modules $(IMAGE):dev

build-prod:
		docker buildx build \
			--platform=$(PLATFORM) \
			--load \
			-t $(IMAGE_FULL):$(TAG) \
			--build-arg VITE_APP_ENV=production \
			--build-arg VITE_ANALYTICS_URL="$(VITE_ANALYTICS_URL)" \
			--build-arg VITE_SENTRY_DSN="$(VITE_SENTRY_DSN)" \
			-f $(DOCKERFILE) .

run-prod:
		docker run --rm \
			-p 8080:80 \
			$(IMAGE_FULL):$(TAG)

push-prod:
		@if [ -z "$(REGISTRY)" ]; then \
				echo "Error: REGISTRY not set. Usage: make push-prod REGISTRY=your-username"; \
				exit 1; \
		fi
		docker buildx build \
			--platform=$(PLATFORM) \
			--push \
			-t $(IMAGE_FULL):$(TAG) \
			--build-arg VITE_APP_ENV=production \
			--build-arg VITE_ANALYTICS_URL="$(VITE_ANALYTICS_URL)" \
			--build-arg VITE_SENTRY_DSN="$(VITE_SENTRY_DSN)" \
			-f $(DOCKERFILE) .

clean:
		rm -rf $(BUILD_DIR)

help:
	@echo "Targets:"
	@echo "  run-dev     Run dev server in Docker"
	@echo "  build-prod  Build production image"
	@echo "  run-prod    Run production image locally"
	@echo "  push-prod   Build multi-arch image (amd64+arm64) and push (REGISTRY required)"
