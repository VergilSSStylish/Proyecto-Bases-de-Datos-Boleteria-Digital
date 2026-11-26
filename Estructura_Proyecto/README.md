
# Instrucciones para levantar el servidor

1. Asegurarse de que la base de datos exista en MySQL Workbench.

2. Antes de instalar dependencias, asegurarse de que los archivos estén ubicados correctamente:

   → Dentro de `Estructura_Proyecto` deben encontrarse los archivos `.env`, `package.json` y `server.js`.

3. En el archivo `.env`, asegurarse de cambiar los valores de `DB_USER` y `DB_PASSWORD` por los configurados en MySQL.

4. Se debe añadir esta línea en el `.env`:

   ```dotenv
   JWT_SECRET=clave_secreta_del_proyecto
   ```

5. Todos los comandos siguientes deben ejecutarse desde la carpeta `Estructura_Proyecto`:

   ```bash
   cd Estructura_Proyecto
   npm init -y
   npm install express mysql2 dotenv cors
   node server.js
   ```

---

## Nodemon (opcional)

Si desean no estar encendiendo y apagando el servidor, tienen que instalar nodemon.

Antes de esto deben verificar que el `package.json` esté en la carpeta `Estructura_Proyecto`.

Luego:

```bash
npm i nodemon -D
```

Y en el `package.json` deben añadir la siguiente línea al apartado de `scripts`:

```json
"dev": "cd backend && npx nodemon server.js"
```

Quedando así:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "cd backend && npx nodemon server.js"
},
```

Y luego, una vez ubicados en la terminal en `Estructura_Proyecto>`, colocan el comando:

```bash
npm run dev
```

y se reiniciará solo cada vez que haya un cambio.

---

## Hashing de contraseñas

Para el hashing de contraseña ejecutar:

```bash
npm.cmd install bcrypt
```

Sirve para proteger las contraseñas de los usuarios.

---

## Base de datos

En la base de datos ejecutar esto para que los usuarios tengan de contraseña `Prueba123` y poder probar el login:

```sql
USE proyecto_basededatos;

UPDATE Usuario
SET PasswordEncriptado = '$2b$10$8cKvl3ZeChTsQlF1eD5ifODRAg7lkqdZBd0obaJrDZl8wcWqczUxi'
WHERE Correo LIKE 'usuario%@ejemplo.test';
```

También hay un campo de `IDRol` que creo que se nos olvidó eliminar; no da registro si está en la BD. Entonces ejecutan:

```sql
ALTER TABLE Usuario
DROP COLUMN IDRol;
```