.PHONY: compile test

test:
	deno test -A

compile:
	deno compile --unstable -A main.ts
