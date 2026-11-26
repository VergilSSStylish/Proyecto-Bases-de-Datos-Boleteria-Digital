
Instrucciones para levantar el servidor:
1. Asegurarse de que la base de datos exista en MySQL Workbench
2. Antes de instalar dependencias, asegurarse de que los archivos estén ubicados correctamente:
--> Dentro de Estructura_Proyecto deben encontrarse los archivos .env, package.json y server.js
3. En el archivo .env, asegurarse de cambiar los valores de DB_USER y DB_PASSWORD por los configurados en MySQL
4. Todos los comandos siguientes deben ejecutarse desde la carpeta Estructura_Proyecto
  cd Estructura_Proyecto
  npm init -y 
  npm install express mysql2 dotenv cors
  node server.js 

Si desean no estar encendiendo y apagando el servidor tienen que instalar nodemon
Antes de esto deben verificar que los package.json esten en la carpeta Estructura_Proyecto
Luego:
 npm i nodemon -D

Y en el package.json deben de añadir la siguiente linea al apartado de scripts
"dev" : "cd backend && npx nodemon server.js".

Quedando asi:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "cd backend && npx nodemon server.js"
  },

  y luego una vez ubicados en la terminal, en Estructura_Proyecto>
  colocan el comando npm run dev

  y se reiniciará solo cada vez que haya un cambio

