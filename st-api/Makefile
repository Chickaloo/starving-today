PORT=81

all: kill build test
# enable push

kill:
	@echo "### killing old apis"
	@ps -ef | grep st-api | awk '{print $$2}' | pkill -f

build:
	@echo "### building"
	@go build

test:
	@echo "### testing with debug port $(PORT)"
	@./st-api --debug --port $(PORT) &
