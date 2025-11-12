PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS universities;
DROP TABLE IF EXISTS districts;

CREATE TABLE districts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE universities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE citizens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  gender TEXT,
  birth_date TEXT,
  phone TEXT,
  email TEXT,
  marital_status TEXT,
  company_id INTEGER,
  school_id INTEGER,
  university_id INTEGER,
  district_id INTEGER,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL
);
