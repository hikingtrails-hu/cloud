.PHONY: dev test format-code lint verify dev init-remix-app app-dev remix-dev init tsnode

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

BIN=node_modules/.bin
PRETTIER=$(BIN)/prettier
TSC=$(BIN)/tsc
TSNODE=$(BIN)/ts-node -r alias-hq/init

default: dist

node_modules: package.json yarn.lock
	yarn --frozen-lockfile
	touch node_modules

format-code: node_modules
	$(PRETTIER) --write .

lint: node_modules
	$(PRETTIER) --check .

verify: lint check-types test

test: node_modules
	$(BIN)/jest --coverage

dist: node_modules
	$(TSC) -p ./src --pretty
	scripts/resolve-imports

check-types: node_modules
	$(TSC) -p . --noEmit

start-docker:
	docker-compose up -d

stop-docker:
	docker-compose stop

dev: node_modules start-docker
	$(BIN)/nodemon

.env: .env.development
	cp .env.development .env

init: .env node_modules

tsnode: node_modules
	$(TSNODE)
