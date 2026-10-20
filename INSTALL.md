
# Guía de instalación - Lista de tareas

## 1. Descripción

Aplicación web desarrollada con Node.js, Express.js y PostgreSQL que permite registrar, consultar, completar y eliminar tareas.

## 2. Tecnologías y versiones

- Node.js: 24.21.0
- npm: 11.19.0
- PostgreSQL: 17.0
- Express.js: 5.3.0
- pg: 8.23.1
- dotenv: 18.0.8
- Helmet: 8.3.0

## 3. Requisitos previos

- Windows 11
- Node.js y npm
- PostgreSQL 17
- Visual Studio Code (recomendado)

## 4. Instalación de dependencias

Abrir una terminal en la carpeta del proyecto y ejecutar:

```powershell
npm install
```

## 5. Configuración de la base de datos

Crear una base de datos PostgreSQL llamada:

`lista_tareas_db`

Ejecutar el script de inicialización:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d lista_tareas_db -f database/init.sql
```

El script crea la tabla de tareas, sus restricciones y el índice correspondiente.

## 6. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lista_tareas_db
DB_USER=postgres
DB_PASSWORD=CONTRASEÑA_LOCAL
PORT=3000
```

Sustituir `CONTRASEÑA_LOCAL` por la contraseña correspondiente de PostgreSQL.

No compartir ni publicar el archivo `.env`.


## 7. Configuración del dominio local

Editar el archivo hosts de Windows:

C:\Windows\System32\drivers\etc\hosts

Agregar la siguiente línea:

127.0.0.1 listatareas.test

Guardar los cambios y ejecutar en PowerShell:

ipconfig /flushdns

## 8. Configuración del certificado HTTPS

Descargar mkcert desde:
https://github.com/FiloSottile/mkcert

Versión utilizada: 1.4.4

Instalar la autoridad certificadora local:

& "C:\Herramientas\mkcert\mkcert.exe" -install

Crear una carpeta llamada certs en la raíz del proyecto.

Generar el certificado y la clave privada:

& "C:\Herramientas\mkcert\mkcert.exe" -cert-file certs/cert.pem -key-file certs/key.pem listatareas.test

Los archivos generados no deben publicarse ni compartirse.

## 9. Ejecución de la aplicación

Iniciar el servidor:

node server.js

Abrir la aplicación mediante:

https://listatareas.test:3443

Las solicitudes realizadas a:

http://listatareas.test:3000

son redirigidas automáticamente a HTTPS.

## 10. Funcionalidades

- Registrar nuevas tareas.
- Consultar tareas almacenadas.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Conservar los cambios en PostgreSQL.
- Consultar el Aviso de Privacidad.
- Consultar los Términos y Condiciones.

## 11. Seguridad

La aplicación incorpora las siguientes medidas:

- Conexión HTTPS mediante certificado TLS local.
- Redirección HTTP hacia HTTPS.
- Encabezados de seguridad mediante Helmet.
- Content-Security-Policy (CSP).
- Strict-Transport-Security (HSTS).
- X-Content-Type-Options.
- Consultas SQL parametrizadas.
- Variables de entorno para separar credenciales del código.

Los archivos .env y certs/ se excluyen mediante .gitignore.

El proyecto fue desarrollado para un entorno local de simulación y no está preparado para su publicación directa en producción.

## 12. Verificación

Para verificar la conexión con PostgreSQL:

node test-db.js

Para comprobar los encabezados HTTP:

(Invoke-WebRequest -Uri "https://listatareas.test:3443" -UseBasicParsing).Headers

Las pruebas funcionales se realizaron en Brave y Microsoft Edge.

Resultados de Lighthouse:

- Performance: 100
- Accessibility: 100
- Best Practices: 96
- SEO: 90
