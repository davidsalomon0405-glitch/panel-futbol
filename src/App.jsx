
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api'

const decoracionEquipos = {
  1: { escudo: '🦁', color: '#e85d3f' },
  2: { escudo: '👑', color: '#3878f5' },
  3: { escudo: '🐺', color: '#24a878' },
  4: { escudo: '🛡️', color: '#a56af5' },
  5: { escudo: '⚡', color: '#e9a23b' },
  6: { escudo: '🔥', color: '#e94c76' },
}

async function consultarDatos() {
  const [respuestaEquipos, respuestaPartidos, respuestaTabla] =
    await Promise.all([
      fetch(`${API_URL}/teams`),
      fetch(`${API_URL}/matches`),
      fetch(`${API_URL}/standings`),
    ])

  if (!respuestaEquipos.ok || !respuestaPartidos.ok || !respuestaTabla.ok) {
    throw new Error('No se pudieron cargar los datos del torneo.')
  }

  const [equipos, partidos, tabla] = await Promise.all([
    respuestaEquipos.json(),
    respuestaPartidos.json(),
    respuestaTabla.json(),
  ])

  return { equipos, partidos, tabla }
}

function App() {
  const [equiposApi, setEquiposApi] = useState([])
  const [partidos, setPartidos] = useState([])
  const [posiciones, setPosiciones] = useState([])
  const [cargando, setCargando] = useState(true)

  const [local, setLocal] = useState('1')
  const [visitante, setVisitante] = useState('2')
  const [golesLocal, setGolesLocal] = useState('')
  const [golesVisitante, setGolesVisitante] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  const equipos = equiposApi.map((equipo) => ({
    ...equipo,
    nombre: equipo.name.split(' ').slice(0, -1).join(' '),
    ...decoracionEquipos[equipo.id],
  }))

  const tabla = posiciones.map((equipo) => {
    const datosEquipo = equipos.find((item) => item.id === equipo.id)

    return {
      ...datosEquipo,
      pj: equipo.played,
      pg: equipo.won,
      pe: equipo.drawn,
      pp: equipo.lost,
      gf: equipo.goalsFor,
      gc: equipo.goalsAgainst,
      dg: equipo.goalDifference,
      pts: equipo.points,
    }
  })

  const partidosAdaptados = partidos.map((partido) => ({
    id: partido.id,
    local: partido.localTeamId,
    visitante: partido.visitorTeamId,
    golesLocal: partido.localGoals,
    golesVisitante: partido.visitorGoals,
  }))

  useEffect(() => {
    let activo = true

    consultarDatos()
      .then((datos) => {
        if (!activo) return
        setEquiposApi(datos.equipos)
        setPartidos(datos.partidos)
        setPosiciones(datos.tabla)
      })
      .catch((error) => {
        if (!activo) return
        setTipoMensaje('error')
        setMensaje(error.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  async function recargarDatos() {
    const datos = await consultarDatos()
    setEquiposApi(datos.equipos)
    setPartidos(datos.partidos)
    setPosiciones(datos.tabla)
  }

  const obtenerEquipo = (id) =>
    equipos.find((equipo) => equipo.id === Number(id))

  async function registrarPartido(e) {
    e.preventDefault()

    if (local === visitante) {
      setTipoMensaje('error')
      setMensaje('Selecciona dos equipos diferentes.')
      return
    }

    if (
      golesLocal.trim() === '' ||
      golesVisitante.trim() === '' ||
      !Number.isInteger(Number(golesLocal)) ||
      !Number.isInteger(Number(golesVisitante)) ||
      Number(golesLocal) < 0 ||
      Number(golesVisitante) < 0
    ) {
      setTipoMensaje('error')
      setMensaje('Los goles deben ser números enteros no negativos.')
      return
    }

    try {
      const respuesta = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localTeamId: Number(local),
          visitorTeamId: Number(visitante),
          localGoals: Number(golesLocal),
          visitorGoals: Number(golesVisitante),
        }),
      })

      const resultado = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(resultado.message || 'No se pudo registrar el partido.')
      }

      await recargarDatos()

      setGolesLocal('')
      setGolesVisitante('')
      setTipoMensaje('success')
      setMensaje('¡Resultado registrado correctamente!')
    } catch (error) {
      setTipoMensaje('error')
      setMensaje(error.message || 'Error al conectar con el servidor.')
    }
  }

  async function eliminarPartido(id) {
    try {
      const respuesta = await fetch(`${API_URL}/matches/${id}`, {
        method: 'DELETE',
      })

      const resultado = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(resultado.message || 'No se pudo eliminar el partido.')
      }

      await recargarDatos()

      setTipoMensaje('success')
      setMensaje('Resultado eliminado correctamente.')
    } catch (error) {
      setTipoMensaje('error')
      setMensaje(error.message || 'Error al conectar con el servidor.')
    }
  }

  const partidosFiltrados = partidosAdaptados.filter(
    (partido) =>
      filtro === 'todos' ||
      partido.local === Number(filtro) ||
      partido.visitante === Number(filtro),
  )

  const totalGoles = partidosAdaptados.reduce(
    (total, partido) =>
      total + partido.golesLocal + partido.golesVisitante,
    0,
  )

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#inicio">
          <span className="brand-icon">⚽</span>
          <span>
            CANCHA<span className="brand-accent">PRO</span>
          </span>
        </a>

        <span className="season">TORNEO AMATEUR · 2026</span>
      </header>

      <section className="hero" id="inicio">
        <div>
          <p className="eyebrow">CENTRO DE COMPETICIÓN</p>
          <h1>
            El fútbol se vive
            <br />
            en la <span>tabla.</span>
          </h1>
          <p className="hero-description">
            Cada partido cuenta. Registra resultados y sigue la lucha
            por el campeonato.
          </p>
        </div>

        <div className="hero-ball">⚽</div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Equipos</span>
          <strong>{equipos.length.toString().padStart(2, '0')}</strong>
          <small>En competencia</small>
        </article>

        <article className="stat-card">
          <span>Partidos</span>
          <strong>{partidos.length.toString().padStart(2, '0')}</strong>
          <small>Resultados registrados</small>
        </article>

        <article className="stat-card">
          <span>Goles</span>
          <strong>{totalGoles.toString().padStart(2, '0')}</strong>
          <small>En todo el torneo</small>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LOS PROTAGONISTAS</p>
            <h2>Equipos participantes</h2>
          </div>
          <span className="count-pill">{equipos.length} EQUIPOS</span>
        </div>

        <div className="teams-grid">
          {equipos.map((equipo) => (
            <article className="team-card" key={equipo.id}>
              <div
                className="team-crest"
                style={{ '--team-color': equipo.color }}
              >
                {equipo.escudo}
              </div>
              <div>
                <strong>{equipo.nombre}</strong>
                <small>Club participante</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ACTUALIZAR COMPETICIÓN</p>
              <h2>Registrar partido</h2>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={registrarPartido}>
            <label htmlFor="local">Equipo local</label>
            <select
              id="local"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              disabled={cargando}
            >
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.escudo} {equipo.nombre}
                </option>
              ))}
            </select>

            <div className="score-inputs">
              <div>
                <label htmlFor="golesLocal">Goles local</label>
                <input
                  id="golesLocal"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(e.target.value)}
                  placeholder="0"
                />
              </div>

              <span className="versus">VS</span>

              <div>
                <label htmlFor="golesVisitante">Goles visitante</label>
                <input
                  id="golesVisitante"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <label htmlFor="visitante">Equipo visitante</label>
            <select
              id="visitante"
              value={visitante}
              onChange={(e) => setVisitante(e.target.value)}
              disabled={cargando}
            >
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.escudo} {equipo.nombre}
                </option>
              ))}
            </select>

            {mensaje && (
              <p
                className="form-message"
                role="status"
                style={
                  tipoMensaje === 'error'
                    ? { color: '#ff9c9c', background: '#321d1d' }
                    : undefined
                }
              >
                {mensaje}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={cargando}
            >
              Registrar resultado <span>→</span>
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LA CARRERA POR EL TÍTULO</p>
              <h2>Tabla de posiciones</h2>
            </div>
            <span className="count-pill">EN VIVO</span>
          </div>

          <div className="table-wrap">
            <table className="standings">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>PTS</th>
                </tr>
              </thead>

              <tbody>
                {tabla.map((equipo, index) => (
                  <tr key={equipo.id}>
                    <td className={index === 0 ? 'rank top-rank' : 'rank'}>
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    <td>
                      <div className="table-team">
                        <span>{equipo.escudo}</span>
                        <strong>{equipo.nombre}</strong>
                      </div>
                    </td>

                    <td>{equipo.pj}</td>
                    <td>{equipo.pg}</td>
                    <td>{equipo.pe}</td>
                    <td>{equipo.pp}</td>
                    <td>{equipo.gf}</td>
                    <td>{equipo.gc}</td>

                    <td className={equipo.dg > 0 ? 'positive' : ''}>
                      {equipo.dg > 0 ? '+' : ''}
                      {equipo.dg}
                    </td>

                    <td className="points">{equipo.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="table-note">
            PJ: jugados · PG: ganados · PE: empatados · PP: perdidos
            · GF: goles a favor · GC: goles en contra · DG: diferencia
            · PTS: puntos
          </p>
        </section>
      </section>

      <section className="panel">
        <div className="section-heading history-heading">
          <div>
            <p className="eyebrow">TODOS LOS ENCUENTROS</p>
            <h2>Historial de resultados</h2>
          </div>

          <select
            aria-label="Filtrar partidos por equipo"
            className="filter-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos los equipos</option>

            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {partidosFiltrados.length === 0 ? (
          <div className="empty-state">
            <span>◷</span>
            <strong>No hay resultados para mostrar</strong>
            <p>
              {partidos.length === 0
                ? 'Registra el primer partido para empezar a construir el historial.'
                : 'No hay partidos registrados para el equipo seleccionado.'}
            </p>
          </div>
        ) : (
          <div className="match-list">
            {partidosFiltrados.map((partido) => {
              const equipoLocal = obtenerEquipo(partido.local)
              const equipoVisitante = obtenerEquipo(partido.visitante)

              return (
                <article className="match-card" key={partido.id}>
                  <div className="match-team">
                    <span>{equipoLocal.escudo}</span>
                    <strong>{equipoLocal.nombre}</strong>
                  </div>

                  <div className="match-score">
                    <strong>
                      {partido.golesLocal} - {partido.golesVisitante}
                    </strong>
                    <small>FINALIZADO</small>
                  </div>

                  <div className="match-team away-team">
                    <span>{equipoVisitante.escudo}</span>
                    <strong>{equipoVisitante.nombre}</strong>
                  </div>

                  <button
                    className="delete-button"
                    type="button"
                    aria-label={`Eliminar partido entre ${equipoLocal.nombre} y ${equipoVisitante.nombre}`}
                    title="Eliminar resultado"
                    onClick={() => eliminarPartido(partido.id)}
                  >
                    ×
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          ⚽ CANCHA<span className="brand-accent">PRO</span>
        </a>
        <span>Panel de competición · Torneo amateur 2026</span>
      </footer>
    </main>
  )
}

export default App
