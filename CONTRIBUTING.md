## Estilo

https://deno.land/manual@v1.7.5/contributing/style_guide

## GIT COMMIT

la bitacora de git es una guia para el historico del proyecto, por eso
es importante una documentacion que pueda ser navegable e entendible.

Los mensajes siguen [commit convencionales](https://www.conventionalcommits.org/es/v1.0.0-beta.3/).

~~~~
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[nota de pie opcional]
~~~

### Tipo

Debe seguir:

* **build**: Changes that affect the build system or external dependencies (scopes: docker, elixir).
* **ci**: Changes to our CI configuration files and scripts (scopes: jenkins)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
* **chore**: (updating rake tasks etc; no production code change)
