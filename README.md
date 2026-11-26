# CANCHAPRO — Panel de resultados de fútbol

## Descripción

CANCHAPRO es una aplicación web desarrollada con React para administrar los resultados de un torneo de fútbol amateur. Permite consultar los equipos participantes, registrar marcadores, revisar el historial de partidos y visualizar una tabla de posiciones que se actualiza automáticamente.

El proyecto fue desarrollado como actividad académica para poner en práctica los componentes funcionales, los Hooks y el manejo de eventos en React, además de la comunicación entre el frontend y un backend mediante una API REST.

## Funcionalidades

- **Equipos participantes:** muestra seis equipos con identificadores únicos, nombres y escudos representados mediante emojis.
- **Registro de partidos:** permite seleccionar los equipos local y visitante e ingresar el marcador.
- **Validaciones:** impide registrar un partido entre el mismo equipo y verifica que los goles sean enteros no negativos.
- **Historial de resultados:** muestra los partidos registrados y permite filtrarlos por equipo.
- **Eliminación de partidos:** permite borrar un resultado y actualizar automáticamente las estadísticas.
- **Tabla de posiciones:** calcula los partidos jugados, ganados, empatados y perdidos, los goles a favor y en contra, la diferencia de goles y los puntos.
- **Ordenamiento automático:** organiza la tabla por puntos, diferencia de goles y goles a favor.
- **Almacenamiento en el servidor:** los resultados se administran desde el backend y se almacenan temporalmente en la memoria del servidor.
- **Diseño adaptable:** cuenta con una interfaz que se ajusta a computadores y dispositivos móviles.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- HTML
- CSS
- Node.js
- Express
- TypeScript
- CORS
- Git y GitHub

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Un navegador web actualizado.
- Git, si se desea clonar el repositorio desde la terminal.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/davidsalomon0405-glitch/panel-futbol.git
```

### 2. Entrar en la carpeta del proyecto

```bash
cd panel-futbol
```

### 3. Instalar las dependencias del frontend

```bash
npm install
```

### 4. Ejecutar el backend

Abrir una terminal y ejecutar:

```bash
cd backend
npm install
npm run dev
```

El servidor backend estará disponible en:

`http://127.0.0.1:3001`

### 5. Ejecutar el frontend

Abrir una segunda terminal desde la carpeta principal del proyecto:

```bash
npm run dev
```

Abrir en el navegador la dirección local que aparece en la terminal, normalmente:

`http://localhost:5173/`

**Nota:** para utilizar la aplicación correctamente, tanto el backend como el frontend deben permanecer ejecutándose simultáneamente.

## API REST

El backend desarrollado con Express y TypeScript proporciona los siguientes endpoints:

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/teams` | Obtiene los equipos participantes. |
| GET | `/api/matches` | Consulta los partidos registrados. |
| POST | `/api/matches` | Registra un nuevo partido. |
| DELETE | `/api/matches/:id` | Elimina un partido mediante su identificador. |
| GET | `/api/standings` | Obtiene la tabla de posiciones calculada. |

## Cálculo de la tabla de posiciones

Las estadísticas se calculan a partir de los partidos registrados.

- **PJ:** cantidad de partidos jugados.
- **PG:** partidos ganados.
- **PE:** partidos empatados.
- **PP:** partidos perdidos.
- **GF:** goles marcados por el equipo.
- **GC:** goles recibidos.
- **DG:** goles a favor menos goles en contra.
- **PTS:** puntos acumulados.

La puntuación se asigna de la siguiente manera:

- Victoria: 3 puntos.
- Empate: 1 punto.
- Derrota: 0 puntos.

La clasificación se ordena por puntos de mayor a menor. Si dos equipos tienen los mismos puntos, se compara la diferencia de goles y, si persiste el empate, los goles a favor.

## Componentes y manejo del estado

La aplicación se organiza en componentes funcionales y utiliza Hooks de React.

- **App:** componente principal que integra la interfaz y administra la información.
- **useState:** controla los partidos, los equipos, los marcadores ingresados, el filtro y los mensajes.
- **useEffect:** permite consultar los datos de la API cuando se carga la aplicación.
- **map():** recorre los equipos, las posiciones y los partidos para mostrarlos en pantalla.
- **filter():** filtra el historial por equipo y permite actualizar la lista después de eliminar resultados.
- **sort():** organiza la tabla de posiciones.
- **onSubmit, onChange y onClick:** gestionan el registro de partidos, los cambios en los formularios y la eliminación de resultados.
- **fetch():** permite realizar solicitudes HTTP al backend para consultar, registrar y eliminar información.

## Backend y almacenamiento de los datos

El backend está desarrollado con Node.js, Express y TypeScript. Se encarga de recibir las solicitudes del frontend, validar la información y administrar los partidos registrados.

Los datos de los equipos están definidos en el servidor y los partidos se almacenan en un arreglo en memoria.

No se utiliza una base de datos ni almacenamiento local del navegador. Por esta razón, los partidos registrados se conservan mientras el servidor permanece ejecutándose, pero se pierden cuando el backend se reinicia.

## Estructura del proyecto

```text
panel-futbol/
├── backend/
│   ├── src/
│   │   └── server.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

La estructura puede incluir otros archivos y carpetas generados durante la instalación y compilación del proyecto.

## Alcance del proyecto

La aplicación funciona con seis equipos predefinidos y permite administrar los resultados de un torneo mediante una API REST.

No incluye autenticación de usuarios ni una base de datos permanente. La información de los partidos se mantiene temporalmente en la memoria del servidor.

## Autoría

Proyecto académico desarrollado para practicar el uso de React, JavaScript, Node.js, Express y TypeScript, así como la comunicación entre frontend y backend mediante una API REST.