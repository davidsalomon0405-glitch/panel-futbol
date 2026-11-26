

import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface Team {
  id: number;
  name: string;
}

interface Match {
  id: string;
  localTeamId: number;
  visitorTeamId: number;
  localGoals: number;
  visitorGoals: number;
}

const teams: Team[] = [
  { id: 1, name: "Atlético Norte 🦁" },
  { id: 2, name: "Real Caribe 👑" },
  { id: 3, name: "Deportivo Sur 🐺" },
  { id: 4, name: "Unión Central 🛡️" },
  { id: 5, name: "Sporting FC ⚡" },
  { id: 6, name: "Titanes FC 🔥" }
];

// Los partidos se almacenan en la memoria del servidor.
let matches: Match[] = [];

app.get("/api/teams", (_req: Request, res: Response) => {
  res.json(teams);
});

app.get("/api/matches", (_req: Request, res: Response) => {
  res.json(matches);
});

app.post("/api/matches", (req: Request, res: Response) => {
  const { localTeamId, visitorTeamId, localGoals, visitorGoals } = req.body;

  if (
    !Number.isInteger(localTeamId) ||
    !Number.isInteger(visitorTeamId) ||
    !Number.isInteger(localGoals) ||
    !Number.isInteger(visitorGoals) ||
    localGoals < 0 ||
    visitorGoals < 0
  ) {
    return res.status(400).json({ message: "Datos del partido inválidos." });
  }

  if (localTeamId === visitorTeamId) {
    return res.status(400).json({ message: "Los equipos deben ser diferentes." });
  }

  if (
    !teams.some((team) => team.id === localTeamId) ||
    !teams.some((team) => team.id === visitorTeamId)
  ) {
    return res.status(400).json({ message: "Uno o ambos equipos no existen." });
  }

  const newMatch: Match = {
    id: Date.now().toString(),
    localTeamId,
    visitorTeamId,
    localGoals,
    visitorGoals
  };

  matches.push(newMatch);

  return res.status(201).json(newMatch);
});

app.delete("/api/matches/:id", (req: Request, res: Response) => {
  const matchExists = matches.some((match) => match.id === req.params.id);

  if (!matchExists) {
    return res.status(404).json({ message: "Partido no encontrado." });
  }

  matches = matches.filter((match) => match.id !== req.params.id);

  return res.json({ message: "Partido eliminado correctamente." });
});

app.get("/api/standings", (_req: Request, res: Response) => {
  const standings = teams.map((team) => {
    const stats = {
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    };

    matches.forEach((match) => {
      if (
        match.localTeamId !== team.id &&
        match.visitorTeamId !== team.id
      ) {
        return;
      }

      const isLocal = match.localTeamId === team.id;
      const goalsFor = isLocal ? match.localGoals : match.visitorGoals;
      const goalsAgainst = isLocal ? match.visitorGoals : match.localGoals;

      stats.played++;
      stats.goalsFor += goalsFor;
      stats.goalsAgainst += goalsAgainst;

      if (goalsFor > goalsAgainst) {
        stats.won++;
        stats.points += 3;
      } else if (goalsFor === goalsAgainst) {
        stats.drawn++;
        stats.points += 1;
      } else {
        stats.lost++;
      }
    });

    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

    return stats;
  });

  standings.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name)
  );

  res.json(standings);
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`CANCHAPRO API ejecutándose en http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
  console.error("Error al iniciar el servidor:", error);
});

setInterval(() => {
  console.log("CANCHAPRO sigue activo");
}, 10000);