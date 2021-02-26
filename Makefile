.PHONY: linter compile test

test:
	deno test

compile:
	deno compile --unstable main.ts

linter:
	deno lint --unstable
