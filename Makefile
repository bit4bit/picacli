.PHONY: linter compile test

test:
	deno test -A

compile:
	deno compile --unstable main.ts
