# Ayuno — App de Fasting

App móvil en **Expo (React Native)** para ayuno intermitente y ayuno profundo de **72 horas**, con guía didáctica por fases metabólicas.

## Características

- **Protocolos:** 16:8, 18:6, 20:4, OMAD y **72h (Más potente)**
- **Timer en vivo** con progreso y tiempo restante
- **Timeline de 7 fases** para el ayuno de 72h (transición → cetosis → autofagia → cierre)
- **Tarjetas educativas** por fase (qué ocurre, sensaciones, consejos)
- **Preparación obligatoria** antes del ayuno de 72h (checklist + contraindicaciones)
- **Guía de refeed** al completar 72h
- **Notificaciones por fase (72h):** avisos al entrar en cada fase y al completar 72h
- **Ajustes:** activar/desactivar notificaciones y ver próximos avisos

## Requisitos

- Node.js 18+
- Expo Go (móvil) o emulador

## Instalación

```bash
cd fasting-app
npm install
npm start
```

Luego escanea el QR con **Expo Go** o pulsa `w` para abrir en web.

## Estructura

```
src/
  components/   # Timer, timeline, tarjetas de fase
  context/      # Estado global + persistencia
  data/         # Protocolos y fases 72h
  hooks/        # useFastingTimer
  navigation/   # Tabs + stack
  screens/      # Home, Protocolos, Historial, Prep 72h, Refeed
  theme/        # Colores
  types/        # TypeScript
  utils/        # Formato de tiempo
```

## Disclaimer

Esta app es educativa. El ayuno prolongado no sustituye consejo médico. Consulta a un profesional si tienes condiciones de salud.
