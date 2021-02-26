.PHONY: linter

compile:
	deno compile --unstable main.ts

linter:
	deno lint --unstable
