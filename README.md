# CANCHAPRO — Panel de resultados de fútbol

## Descripción

CANCHAPRO es una aplicación web desarrollada con React para administrar los resultados de un torneo de fútbol amateur. Permite consultar los equipos participantes, registrar marcadores, revisar el historial de partidos y visualizar una tabla de posiciones que se actualiza automáticamente.

El proyecto fue desarrollado como actividad académica para poner en práctica los componentes funcionales, los Hooks y el manejo de eventos en React.

## Funcionalidades

- **Equipos participantes:** muestra seis equipos con identificadores únicos, nombres y escudos representados mediante emojis.
- **Registro de partidos:** permite seleccionar los equipos local y visitante e ingresar el marcador.
- **Validaciones:** impide registrar un partido entre el mismo equipo y verifica que los goles sean enteros no negativos.
- **Historial de resultados:** muestra los partidos registrados y permite filtrarlos por equipo.
- **Eliminación de partidos:** permite borrar un resultado y actualizar automáticamente las estadísticas.
- **Tabla de posiciones:** calcula los partidos jugados, ganados, empatados y perdidos, los goles a favor y en contra, la diferencia de goles y los puntos.
- **Ordenamiento automático:** organiza la tabla por puntos, diferencia de goles y goles a favor.
- **Almacenamiento local:** conserva los resultados en el navegador mediante `localStorage`.
- **Diseño adaptable:** cuenta con una interfaz que se ajusta a computadores y dispositivos móviles.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- HTML
- CSS
- Git y GitHub

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Un navegador web actualizado.
- Git, si se desea clonar el repositorio desde la terminal.

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone URL_DEL_REPOSITORIO
   ```

2. Entrar en la carpeta del proyecto:

   ```bash
   cd panel-futbol
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección local que aparece en la terminal, normalmente `http://localhost:5173/`.

**Nota:** reemplaza `URL_DEL_REPOSITORIO` por la dirección real del repositorio de GitHub una vez publicado.

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
- **useEffect:** guarda los partidos en `localStorage` cada vez que cambia la lista de resultados.
- **map():** recorre los equipos, las posiciones y los partidos para mostrarlos en pantalla.
- **filter():** filtra el historial por equipo y permite eliminar resultados.
- **reduce():** calcula las estadísticas y el total de goles.
- **sort():** organiza la tabla de posiciones.
- **onSubmit, onChange y onClick:** gestionan el registro de partidos, los cambios en los formularios y la eliminación de resultados.

## Estructura del proyecto

```text
panel-futbol/
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

La estructura puede incluir otros archivos generados por Vite.

## Almacenamiento de los datos

Los partidos se guardan en el almacenamiento local del navegador. Esto permite conservar los resultados después de recargar la página sin utilizar un servidor o una base de datos.

Los datos pertenecen al navegador utilizado y no se sincronizan automáticamente con otros dispositivos. Si se borran los datos del sitio en el navegador, los resultados guardados pueden perderse.

## Alcance del proyecto

La aplicación funciona sin backend y utiliza equipos predefinidos. No incluye autenticación de usuarios ni sincronización entre dispositivos.

## Autoría

Proyecto académico desarrollado para practicar el uso de React, JavaScript y la gestión de resultados deportivos.
