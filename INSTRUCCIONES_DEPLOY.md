# 🎯 PASOS EXACTOS PARA DESPLEGAR LOS CAMBIOS

## 1️⃣ Abre Git Bash

En Windows, abre **Git Bash** (NO PowerShell):
- Busca "Git Bash" en el menú de inicio
- O haz clic derecho en la carpeta del proyecto → "Git Bash Here"

---

## 2️⃣ Verifica el estado actual

Copia y pega este comando en Git Bash:

```bash
cd "c:/Users/Vicente/Documents/RESPALDO PAGINA DEJO AROMAS/DA_Page - V2"
```

Luego:

```bash
git status
```

Deberías ver:
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   frontend/src/pages/PaymentResult.js
        modified:   frontend/src/services/paymentService.js

Untracked files:
  (use "git add <file>..." to track)
        DIAGNOSTICO_FLUJO_PAGOS.md
        DEPLOY_CAMBIOS.sh
```

---

## 3️⃣ Agrega los cambios

Copia y pega los siguientes comandos uno por uno:

### Opción A: Agregar archivo por archivo

```bash
git add frontend/src/pages/PaymentResult.js
git add frontend/src/services/paymentService.js
git add DIAGNOSTICO_FLUJO_PAGOS.md
```

### Opción B: Agregar todos de una vez

```bash
git add -A
```

---

## 4️⃣ Verifica que se agregaron

```bash
git status
```

Deberías ver todos los archivos en verde bajo "Changes to be committed:"

---

## 5️⃣ Haz el commit

Copia y pega este comando completo:

```bash
git commit -m "Fix: Soportar múltiples escenarios de retorno de Transbank

- PaymentResult.js: Captura token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION
- PaymentResult.js: Detecta automáticamente 4 casos (éxito, rechazo, cancelación, timeout)
- paymentService.js: confirmPayment() acepta payload completo (no solo string token)
- PaymentResult.js: Carga orden incluso si success=false (cancelled/timeout son válidos)
- Agregado: DIAGNOSTICO_FLUJO_PAGOS.md con guía completa de troubleshooting"
```

Deberías ver:
```
[main abc1234] Fix: Soportar múltiples escenarios de retorno de Transbank
 3 files changed, XX insertions(+), YY deletions(-)
 create mode 100644 DIAGNOSTICO_FLUJO_PAGOS.md
```

---

## 6️⃣ Haz el push

Copia y pega:

```bash
git push origin main
```

Deberías ver:
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
...
To github.com:TuUsuario/DA_Page-V2.git
   abc1234...def5678  main -> main
```

---

## 7️⃣ Espera a que se redeploy

Después de hacer push, los servidores se redeployarán automáticamente:

- **Railway** (backend): 1-2 minutos
- **Netlify** (frontend): 2-3 minutos

Puedes ver el estado en:
- Railway: https://railway.app (Dashboard)
- Netlify: https://app.netlify.com (Deployments)

---

## 8️⃣ Prueba los 4 casos

Una vez redeployado, prueba cada escenario:

### Test 1: Éxito ✅
- VISA: `4051885600446623`
- CVV: `123`
- RUT: `11.111.111-1`
- Clave: `123`
- Resultado esperado: **Pantalla VERDE** "¡Pago Completado!"

### Test 2: Rechazo ❌
- MC: `5186059559590568`
- CVV: `123`
- RUT: `11.111.111-1`
- Clave: `123`
- Resultado esperado: **Pantalla ROJA** "Pago Rechazado"

### Test 3: Cancelación ⏹️
- Ingresa cualquier tarjeta
- Presiona botón **"Anular compra"** en el formulario
- Resultado esperado: **Pantalla GRIS** "Cancelaste el pago"

### Test 4: Timeout ⏱️
- Abre el formulario de pago
- Espera 10+ minutos sin hacer nada
- Resultado esperado: **Pantalla NARANJA** "Pago Expirado"

---

## ✅ Checklist Final

- [ ] Git Bash abierto
- [ ] Comando `git status` ejecutado
- [ ] Archivos modificados vístos
- [ ] Comandos `git add` ejecutados
- [ ] Comando `git commit` ejecutado exitosamente
- [ ] Comando `git push` ejecutado exitosamente
- [ ] GitHub muestra los cambios (opcional, verificar en github.com)
- [ ] Railway redeploy completado (esperar 1-2 min)
- [ ] Netlify redeploy completado (esperar 2-3 min)
- [ ] Probaste Test 1 (Éxito) ✅
- [ ] Probaste Test 2 (Rechazo) ❌
- [ ] Probaste Test 3 (Cancelación) ⏹️
- [ ] Probaste Test 4 (Timeout) ⏱️

---

## 🆘 Problemas Comunes

### "Git no se reconoce"
→ Asegúrate de usar **Git Bash**, no PowerShell

### "Permission denied"
→ Verifica que tienes acceso a GitHub (SSH keys configuradas)

### "Merge conflicts"
→ Si aparece conflicto, usa:
```bash
git merge --abort
```
Y luego contacta para ayuda

### Los servidores no redeploy
→ Verifica que el push fue exitoso:
```bash
git log --oneline -5
```
Deberías ver tu commit al tope

---

## ¡Listo! 🚀

Una vez completados todos los pasos y pruebas, el flujo de pagos completamente soportará los 4 escenarios de Transbank.

Cualquier problema, consulta el archivo **DIAGNOSTICO_FLUJO_PAGOS.md** para debugging detallado.
