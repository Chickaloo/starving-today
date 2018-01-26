PORT:81

all: kill build test
# enable push

kill:
	@pkill -f st-api

build:
	@echo "### building"
	@go build

test:
	@echo "### testing with debug port $PORT"
	@./st-api --debug --port $port
