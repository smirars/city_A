import express from "express";
import cors from "cors";
import db from "./db/connection.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/citizens", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const citizens = await db("citizens")
      .select("id", "first_name", "last_name")
      .limit(limit)
      .offset(offset);

    res.json(citizens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch citizens" });
  }
});


app.get("/statistics", async (req, res) => {
  try {

    // Районы
    const districtsData = await db("districts")
      .leftJoin("citizens", "districts.id", "citizens.district_id")
      .groupBy("districts.id")
      .select("districts.name")
      .count("citizens.id as value");

    //Компании 
    const companiesData = await db("companies")
      .leftJoin("citizens", "companies.id", "citizens.company_id")
      .groupBy("companies.id")
      .select("companies.name")
      .count("citizens.id as value");

    // Школы 
    const schoolsData = await db("schools")
      .leftJoin("citizens", "schools.id", "citizens.school_id")
      .groupBy("schools.id")
      .select("schools.name")
      .count("citizens.id as value");

    // Вузы
    const universitiesData = await db("universities")
      .leftJoin("citizens", "universities.id", "citizens.university_id")
      .groupBy("universities.id")
      .select("universities.name")
      .count("citizens.id as value");

    // Возрастные группы
    const citizens = await db("citizens").select("birth_date");
    const currentYear = new Date().getFullYear();
    const ageRanges = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${i * 10 + 10}`,
      count: 0
    }));

    citizens.forEach((c) => {
      if (!c.birth_date) return;
      const birthYear = new Date(c.birth_date).getFullYear();
      const age = currentYear - birthYear;
      const index = Math.min(Math.floor(age / 10), 9);
      ageRanges[index].count += 1;
    });

    res.json({
      districts: districtsData,
      companies: companiesData,
      schools: schoolsData,
      universities: universitiesData,
      ages: ageRanges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});


app.listen(3001, () => console.log("Backend running on port 3001"));
