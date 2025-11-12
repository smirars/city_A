import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./connection.js";
import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const dbPath = path.join(__dirname, "database.sqlite");
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath);

  const schemaPath = path.join(__dirname, "schema.sql");

  if (!fs.existsSync(schemaPath)) {
    console.error(`Файл схемы не найден: ${schemaPath}`);
    process.exit(1);
  }

  const schema = fs.readFileSync(schemaPath, "utf-8");
  const statements = schema
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  for (const stmt of statements) {
    await db.raw(stmt);
  }

  console.log("Tables created");

  const districts = [
    { name: "Центральный" },
    { name: "Северный" },
    { name: "Южный" },
    { name: "Восточный" },
  ];
  await db("districts").insert(districts);

  const companies = [
    { name: "ООО ТехноСфера" },
    { name: "Завод Металлик" },
    { name: "Ресторан Вкусно" },
  ];
  await db("companies").insert(companies);

  const schools = [
    { name: "Школа №1" },
    { name: "Школа №5" },
  ];
  await db("schools").insert(schools);

  const universities = [
    { name: "Московский государственный университет" },
    { name: "Технический институт города А" },
  ];
  await db("universities").insert(universities);

  const citizens = [];

  for (let i = 0; i < 200; i++) {
    citizens.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      gender: faker.person.sexType(),
      birth_date: faker.date.birthdate({ min: 1960, max: 2019, mode: "year" }).toISOString(),
      phone: faker.phone.number("+7 (###) ###-##-##"),
      email: faker.internet.email(),
      marital_status: faker.helpers.arrayElement(["single", "married"]),
      company_id: faker.helpers.maybe(() => faker.number.int({ min: 1, max: companies.length }), { probability: 0.6 }),
      school_id: faker.helpers.maybe(() => faker.number.int({ min: 1, max: schools.length }), { probability: 0.2 }),
      university_id: faker.helpers.maybe(() => faker.number.int({ min: 1, max: universities.length }), { probability: 0.4 }),
      district_id: faker.number.int({ min: 1, max: districts.length }),
    });
  }

  await db("citizens").insert(citizens);

  console.log("Test data inserted");
  process.exit(0);
}

initDatabase();
