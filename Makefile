#
# Copyright (c) Flyover Games, LLC
#

SHELL := /usr/bin/env bash

ANSI_NONE    = "\e[1;0m"
ANSI_BLACK   = "\e[1;30m"
ANSI_RED     = "\e[1;31m"
ANSI_GREEN   = "\e[1;32m"
ANSI_YELLOW  = "\e[1;33m"
ANSI_BLUE    = "\e[1;34m"
ANSI_MAGENTA = "\e[1;35m"
ANSI_CYAN    = "\e[1;36m"
ANSI_WHITE   = "\e[1;37m"

PATH := $(shell npm bin):$(PATH)

DONE = @printf "done: "$(ANSI_GREEN)"%s"$(ANSI_NONE)"\n" $@

all: help

help:
	@echo $(PATH)
	@printf "usage:\n"
	@printf "$$ make <"$(ANSI_YELLOW)"target"$(ANSI_NONE)">\n"
	@printf "target:\n"
	@printf " "$(ANSI_YELLOW)"clean"$(ANSI_NONE)" : clean project\n"
	@printf " "$(ANSI_YELLOW)"build"$(ANSI_NONE)" : build project\n"

clean: clean-box2d
clean: clean-box2d-helloworld
clean: clean-box2d-testbed

build: build-box2d
build: build-box2d-helloworld
build: build-box2d-testbed

# box2d

clean-box2d:
	find Box2D -name "*.js" -delete
	$(DONE)

build-box2d:
	$$(npm bin)/tsc -p Box2D
	$(DONE)

# box2d-helloworld

clean-box2d-helloworld:
	find HelloWorld -name "*.js" -delete
	$(DONE)

build-box2d-helloworld:
	$$(npm bin)/tsc -p HelloWorld
	$(DONE)

# box2d-testbed

clean-box2d-testbed:
	find Testbed -name "*.js" -delete
	$(DONE)

build-box2d-testbed:
	$$(npm bin)/tsc -p Testbed
	$(DONE)
