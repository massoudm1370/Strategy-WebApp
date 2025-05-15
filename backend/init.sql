-- جدول اهداف دپارتمانی
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

-- جدول کاربران
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT,
  department TEXT
);

-- جدول دپارتمان‌ها
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);

-- جدول اهداف سازمانی
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  target TEXT,
  failure TEXT,
  currentStatus TEXT,
  ytd TEXT,
  year INTEGER,
  half TEXT,
  calculationMethod TEXT,
  weight TEXT,
  unit TEXT,
  definitionOfDone TEXT
);

-- جدول استراتژی (Vision, Mission, Values)
CREATE TABLE IF NOT EXISTS strategy (
  id INTEGER PRIMARY KEY,
  vision TEXT,
  mission TEXT,
  core_values TEXT
);

-- جدول KPIها
CREATE TABLE IF NOT EXISTS kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  unit TEXT,
  target INTEGER,
  formula TEXT
);

-- جدول Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL
);
