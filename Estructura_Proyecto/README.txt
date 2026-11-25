
1.Borrar la base de datos anterior en MySQL , ejecutar la base de datos, las vistas y la población de prueba del archivo en mySQL.

2.Abrir la carpeta Estructura_Proyecto en VSCode.
Abrir la terminal y escribir
cd backend
npm init -y
npm install express mysql2 dotenv cors
En la carpeta backend en .env escribir su user y su password de su sesión de MySQL 
reemplazando los valores de user y contraseña por los que tienen en el MySQL(en el tutorial de instalación de MySQL que usamos era user:root y contraseña:admin)

3.En la terminal ejecutar "node server.js" y darle ctrl+click en el enlace.

Si desean no estar encendiendo y apagando el servidor tienen que instalar nodemon
Antes de esto deben verificar que los package json esten en la carpeta Estructura_Proyecto
Luego:
 npm i nodemon -D

Y en el package.json deben de añadir la siguiente linea al apartado de scrips
"dev" : "cd backend && npx nodemon server.js".

Quedando asi:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "cd backend && npx nodemon server.js"
  },

  y luego una vez ubicados en la terminal, en Estructura_Proyecto>
  colocan el comando npm run dev

  y se reiniciara solo cada vez que haya un cambio

