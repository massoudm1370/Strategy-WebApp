CREATE TABLE IF NOT EXISTS department_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department TEXT,
  orgGoalTitle TEXT,
  year INTEGER,
  half TEXT,
  keyResult TEXT,
  weight TEXT,
  target TEXT,
  failure TEXT,
  unit TEXT,
  baseline TEXT,
  calculationMethod TEXT,
  definitionOfDone TEXT,
  monthlyProgress TEXT,
  ytd TEXT,
  finalAchievement TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    department TEXT
);

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    owner TEXT,
    department TEXT,
    year INTEGER,
    halfYear TEXT
);

CREATE TABLE IF NOT EXISTS strategy (
    id INTEGER PRIMARY KEY,
    vision TEXT,
    mission TEXT,
    core_values TEXT
);

CREATE TABLE IF NOT EXISTS kpis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    value INTEGER,
    target INTEGER
);
