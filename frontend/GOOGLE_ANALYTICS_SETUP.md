# 📊 Google Analytics 4 Setup

## Paso 1: Crear cuenta GA4

1. Ve a https://analytics.google.com/
2. Haz clic en "Empezar a medir" o "Admin" (si ya tienes cuenta)
3. Crea una nueva propiedad:
   - **Nombre de la cuenta**: "NBA Player Comparison" (o el que quieras)
   - **Nombre de la propiedad**: "datosconnba"
   - **Zona horaria**: (Europe/Madrid)
   - **Moneda**: EUR

4. Configura el flujo de datos:
   - Selecciona **Web**
   - URL del sitio web: `https://datosconnba.netlify.app`
   - Nombre del flujo: "Producción"

5. Te dará un **ID de medición** con formato: `G-XXXXXXXXXX`
   - **¡Copia este ID!** Lo necesitas para el siguiente paso

## Paso 2: Configurar en el proyecto

### Para desarrollo local:

1. Edita el archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Para producción (Netlify):

1. Ve a tu proyecto en Netlify
2. Site settings → Environment variables
3. Añade la variable:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX`

4. Redeploy el sitio (o espera al siguiente deploy automático)

## Paso 3: Verificar que funciona

1. Despliega/inicia tu app
2. Visita tu web en producción o en local
3. Ve a Google Analytics → Informes → Tiempo real
4. Deberías ver tu visita aparecer en 1-2 minutos

## 📈 Qué puedes ver en GA4

### Informes básicos (sin configuración extra):

- **Tiempo real**: Usuarios activos ahora mismo
- **Usuarios**: Visitas por día/semana/mes
- **Adquisición**: De dónde vienen los usuarios (YouTube, Twitter, directo, etc.)
- **Páginas**: Qué páginas visitan más
- **Geografía**: De qué países/ciudades vienen
- **Dispositivos**: Desktop vs Mobile vs Tablet
- **Tiempo en página**: Cuánto tiempo pasan

### Para trackear el comentario de YouTube:

Cuando compartas el link en YouTube, usa:
```
https://datosconnba.netlify.app/es/aday-mara?utm_source=youtube&utm_campaign=aday_video&utm_medium=comment
```

Luego en GA4 verás en **Adquisición** cuántos vinieron desde "youtube / aday_video".

## 🔍 Cómo ver las métricas

1. Ve a https://analytics.google.com/
2. Selecciona tu propiedad "datosconnba"
3. Navega por:
   - **Informes → Tiempo real**: Usuarios ahora mismo
   - **Informes → Ciclo de vida → Adquisición → Adquisición de usuarios**: Fuentes de tráfico
   - **Informes → Ciclo de vida → Interacción → Páginas y pantallas**: Páginas más visitadas

## 🚨 Troubleshooting

**No veo datos en GA4:**
- Espera 24-48h para que aparezcan datos históricos (tiempo real aparece en minutos)
- Verifica que el `G-XXXXXXXXXX` sea correcto
- Verifica que la variable de entorno esté en Netlify
- Abre las DevTools del navegador → Console, no debería haber errores de GA

**¿Se trackean usuarios con AdBlock?**
- No, los AdBlockers bloquean Google Analytics
- Normalmente ~20-40% de usuarios usan AdBlock, así que los números reales son mayores

## 🎯 Métricas importantes para tu caso:

- **Usuarios**: Cuánta gente visita la web
- **Páginas vistas por sesión**: Si exploran más allá de la landing
- **Tiempo medio de interacción**: Si pasan tiempo usando el comparador
- **Fuentes de tráfico**: Cuántos vienen de YouTube vs otros
- **Tasa de rebote implícita**: Si abandonan sin interactuar

## 💡 Consejos:

1. **Añade parámetros UTM** a todos los links que compartas:
   - YouTube: `?utm_source=youtube&utm_campaign=aday_video`
   - Twitter: `?utm_source=twitter&utm_campaign=launch`
   - Esto te permite saber exactamente de dónde vino cada visita

2. **Configura conversiones** más adelante:
   - Cuando un usuario selecciona un jugador
   - Cuando compara jugadores
   - Esto se puede hacer desde GA4 sin código extra

3. **Revisa Tiempo Real** después de publicar en YouTube:
   - Verás el spike de tráfico inmediato
   - Te ayuda a saber si el comentario funciona
