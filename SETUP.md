# SETUP — Cómo subir esto a tu repo de GitHub

Guía corta y directa. Te lleva del ZIP que te paso a tu repo funcionando en menos de 5 minutos.

---

## Opción 1: Línea de comandos (recomendado para Cursor / Claude Code)

```bash
# 1. Descomprimir el ZIP en una carpeta local
unzip tuktuk-cartagena-web.zip
cd tuktuk-cartagena-web

# 2. Inicializar Git
git init
git branch -M main

# 3. Conectar con tu repo remoto
git remote add origin https://github.com/Ruiperezz/TUK-TUK-CARTAGENA-WEB.git

# 4. Primer commit y push
git add .
git commit -m "feat: initial project setup with prototype design"
git push -u origin main --force
```

> Uso `--force` porque puede que el repo tenga un README inicial creado por GitHub que sobreescribirías. Si el repo está totalmente vacío, no hace falta.

---

## Opción 2: Subida por web (drag & drop)

1. Ve a tu repo: https://github.com/Ruiperezz/TUK-TUK-CARTAGENA-WEB
2. Click en **Add file → Upload files**
3. Arrastra TODOS los archivos descomprimidos (no la carpeta, los archivos sueltos)
4. Mensaje de commit: `feat: initial project setup with prototype design`
5. Commit

Más lento pero no requiere terminal.

---

## Opción 3: GitHub Desktop

1. Abre GitHub Desktop
2. **File → Clone repository → URL** → pega `https://github.com/Ruiperezz/TUK-TUK-CARTAGENA-WEB.git`
3. Copia todos los archivos descomprimidos dentro de la carpeta clonada
4. En GitHub Desktop verás los cambios → escribe mensaje → **Commit to main** → **Push origin**

---

## Después de subirlo

```bash
cd TUK-TUK-CARTAGENA-WEB
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

---

## Si trabajas con Cursor + Claude Code

1. Abre la carpeta del proyecto en Cursor
2. Lo primero que debe leer Claude es **`CLAUDE.md`**. Está pensado para él, no para ti.
3. Para cualquier cambio en diseño, recuérdale **`DESIGN.md`**.
4. Para cualquier cosa del cliente o contenido, **`BRIEFING.md`**.

Buenos primeros prompts para Claude Code:

> Lee CLAUDE.md y DESIGN.md. Quiero añadir validación de aforo máximo (4 personas en compartido) al formulario de reserva. Asegúrate de actualizar las 4 traducciones con el mensaje de error.

> Lee CLAUDE.md. Quiero partir el archivo App.jsx en componentes por sección dentro de src/sections/. Mantén las traducciones en su archivo separado.

> Lee CLAUDE.md y BRIEFING.md. Vamos a empezar a conectar el backend real. ¿Recomiendas Next.js + Stripe + Resend, o WordPress + Bokun?

---

## Borra este archivo después de leerlo

Una vez tengas el repo subido y funcionando, este `SETUP.md` ya no sirve para nada. Bórralo del repo para mantenerlo limpio:

```bash
git rm SETUP.md
git commit -m "chore: remove SETUP.md after initial setup"
git push
```
