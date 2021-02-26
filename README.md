# picacli

**!!not ready for production!!**

cliente para complementar, agilizar y hacer mas efectivo el flujo de trabajo.

Este busca cumplir las tareas siguientes:

 - sincronizar el issue de jira con la rama y el pull request en github
   - last tareas tambien puede ser subtareas
 - seguir la convencion de nombres entre el issue de jira, el nombre de la rama y el pull request
 - todos los procesos ocurren en una unica transaccion es decir si alguno falla
 los otros no se ejecuta o realizan un rollback (eliminar rama, eliminar issue).
 - debe ser un cli facil ya que este flujo no solo para los desarrollos backend/frontend,
 sino para las nuevas integraciones de configuracion e infraestructura como codigo.
 
## inspiraciones

 - https://cli.github.com/
