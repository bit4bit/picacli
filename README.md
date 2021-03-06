# picacli

[![Build Status](https://travis-ci.org/bit4bit/picacli.svg?branch=main)](https://travis-ci.org/bit4bit/picacli)

**!!opiniated please not use it!!!**

cliente para complementar, agilizar y hacer mas efectivo el flujo de trabajo.

Este busca cumplir las tareas siguientes:

 - sincronizar el issue de jira con la rama y el pull request en github
   - last tareas tambien puede ser subtareas
 - seguir la convencion de nombres entre el issue de jira, el nombre de la rama y el pull request
 - todos los procesos ocurren en una unica transaccion es decir si alguno falla
 los otros no se ejecuta o realizan un rollback (eliminar rama, eliminar issue).
 - debe ser un cli facil ya que este flujo no solo para los desarrollos backend/frontend,
 sino para las nuevas integraciones de configuracion e infraestructura como codigo.


## compilar desde fuente

~~~
$ git clone https://github.com/bit4bit/picacli
$ cd picacli
$ deno compile --unstable -A main.ts
~~~

## uso

picacli usa variables de configuracion por directorio, se debe crear en la raiz del directorio proyecto el archivo **.picacli.json**.

### desde issue jira

~~~
$ picacli from <ID>
~~~

### iniciar reloj

~~~
$ picacli clock in
~~~

### detener reloj

~~~
$ picacli clock out
~~~

## por implementar !!

### uso

~~~
$ picacli open 'titulo o summary'
~~~

~~~
$ picacli close
~~~


### uso github

~~~
$ picacli github pr create
~~~

~~~
$ picacli github pr status
~~~

~~~
$ picacli github pr merge
~~~




## inspiraciones

 - https://cli.github.com/
 - https://fossil-scm.org
