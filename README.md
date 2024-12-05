# ChekerProxysBsz
### Análisis y Comprobación de Proxies (IPs con Puertos)

Este código en JavaScript permite validar, clasificar y comprobar proxies (IPs con puertos) mediante diversas funciones que verifican su formato, rango, y accesibilidad. A continuación, se describen las funcionalidades principales:

## Expresión Regular para Validar IP y Puerto

Utiliza la expresión regular `REGEX_IP_PORT` para verificar si un string tiene el formato correcto de una IP con puerto. Ejemplo de formato válido: `192.168.0.1:8080`.

## Validaciones de IP y Puerto

- **`validateIp`**: Verifica que las cuatro partes de la IP estén dentro del rango de 0 a 255.
- **`validatePort`**: Verifica que el puerto esté en el rango válido de 1 a 65535.

## Clasificación de IPs

El código extrae las IPs de un texto y las clasifica en tres categorías:

- **IPs válidas**: Cumplen con el formato y rango correcto.
- **IPs muertas**: El formato es válido, pero la IP o puerto no son accesibles.
- **IPs no válidas**: No cumplen con el formato `IP:Puerto`.

## Actualización de la Interfaz de Usuario

- **`appendToContainer`**: Agrega las IPs a contenedores HTML específicos, como IPs vivas, muertas y no válidas.
- **`updateIpCounters`**: Actualiza los contadores de IPs en la interfaz, mostrando la cantidad de IPs vivas, muertas y no válidas.

## Comprobación de Proxies

- **`checkProxy`**: Verifica si un proxy (IP:Puerto) está funcionando, realizando una solicitud HTTP (GET) a un endpoint (por ejemplo, `https://httpbin.org/ip`) con un tiempo de espera determinado.
- **`simulateLoadingBarAndCheckProxies`**: Simula una barra de carga mientras se comprueban los proxies, actualizando la interfaz con las IPs vivas o muertas.
- **`startCheck`**: Inicia el proceso de comprobación, limpiando las listas, extrayendo las IPs, mostrando una barra de carga y finalmente mostrando los resultados.

## Descargar Resultados

El código permite crear un archivo `.zip` que contiene los resultados de las IPs vivas, muertas y no válidas en archivos `.txt`, utilizando **JSZip** para la compresión. El archivo `.zip` se genera y se descarga automáticamente.

## Resumen

Este código facilita el análisis de una lista de proxies, su clasificación según su estado (vivas, muertas, no válidas), y su verificación de accesibilidad. Los resultados se muestran en una interfaz web y se pueden descargar como archivos comprimidos `.zip` con los detalles de las IPs.
