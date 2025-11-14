import express from "express";
import cors from "cors";
import db from "./db/connection.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/citizens", async (req, res) => {
  try {
    const {
      search = "",
      gender,
      marital_status,
      minAge,
      maxAge,
      company_id,
      school,
      university,
      limit = 100,
      offset = 0,
    } = req.query;

    let query = db("citizens as c")
      .leftJoin("companies as comp", "c.company_id", "comp.id")
      .leftJoin("schools as s", "c.school_id", "s.id")
      .leftJoin("universities as u", "c.university_id", "u.id")
      .leftJoin("districts as d", "c.district_id", "d.id")
      .select(
        "c.id",
        "c.first_name",
        "c.last_name",
        "c.middle_name",
        "c.gender",
        "c.birth_date",
        "c.marital_status",
        "comp.name as company",
        "s.name as school",
        "u.name as university",
        "d.name as district"
      );

    if (gender && gender !== "all") query.where("c.gender", gender);
    if (marital_status && marital_status !== "all") query.where("c.marital_status", marital_status);
    if (company_id) query.where("c.company_id", company_id);
    if (school) query.where("s.name", school);
    if (university) query.where("u.name", university);

    if (minAge || maxAge) {
      const today = new Date();
      if (minAge) {
        const maxBirthDate = new Date(today);
        maxBirthDate.setFullYear(today.getFullYear() - minAge);
        query.where("c.birth_date", "<=", maxBirthDate.toISOString());
      }
      if (maxAge) {
        const minBirthDate = new Date(today);
        minBirthDate.setFullYear(today.getFullYear() - maxAge);
        query.where("c.birth_date", ">=", minBirthDate.toISOString());
      }
    }

    if (search) {
      query.andWhere(function () {
        this.where("c.first_name", "like", `%${search}%`)
          .orWhere("c.last_name", "like", `%${search}%`)
          .orWhereRaw("LOWER(c.first_name || ' ' || c.last_name) LIKE ?", [`%${search.toLowerCase()}%`]);
      });
    }

    query.limit(limit).offset(offset);

    const citizens = await query;
    res.json(citizens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch citizens" });
  }
});

app.get("/meta", async (req, res) => {
  try {
    const companies = await db("companies").select("id", "name");
    const schools = await db("schools").select("id", "name");
    const universities = await db("universities").select("id", "name");

    res.json({ companies, schools, universities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meta data" });
  }
});


app.post("/citizens", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      middle_name,
      gender,
      birth_date,
      phone,
      email,
      marital_status,
      company_id,
      school_id,
      university_id,
      district_id
    } = req.body;

    const [id] = await db("citizens").insert({
      first_name,
      last_name,
      middle_name,
      gender,
      birth_date,
      phone,
      email,
      marital_status,
      company_id: company_id || null,
      school_id: school_id || null,
      university_id: university_id || null,
      district_id: district_id || null
    });

    const createdCitizen = await db("citizens").where({ id }).first();

    res.json(createdCitizen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create citizen" });
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

    const birthYears = await db("citizens")
      .select(db.raw("SUBSTR(birth_date, 1, 4) as year"))
      .count("* as count")
      .groupBy("year")
      .orderBy("year", "asc");
    
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
      ages: ageRanges,
      birthYears: birthYears
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

app.get("/citizens/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const citizen = await db("citizens as c")
      .leftJoin("companies as comp", "c.company_id", "comp.id")
      .leftJoin("schools as s", "c.school_id", "s.id")
      .leftJoin("universities as u", "c.university_id", "u.id")
      .leftJoin("districts as d", "c.district_id", "d.id")
      .select(
        "c.id",
        "c.first_name",
        "c.last_name",
        "c.middle_name",
        "c.gender",
        "c.birth_date",
        "c.phone",
        "c.email",
        "c.marital_status",
        "c.parents",
        "c.children",
        "c.spouse",
        "comp.name as company",
        "s.name as school",
        "u.name as university",
        "d.name as district"
      )
      .where("c.id", id)
      .first();

    if (!citizen) return res.status(404).json({ error: "Citizen not found" });

    const parentIds = citizen.parents ? JSON.parse(citizen.parents) : [];
    const childIds = citizen.children ? JSON.parse(citizen.children) : [];
    const spouseId = citizen.spouse ? [citizen.spouse] : [];

    const allRelativeIds = [...parentIds, ...childIds, ...spouseId];

    let relatives = [];
    if (allRelativeIds.length > 0) {
      relatives = await db("citizens")
        .select("id", "first_name", "last_name", "middle_name")
        .whereIn("id", allRelativeIds);
    }

    const enrichedRelatives = relatives.map((r) => {
      let relation = "";
      if (parentIds.includes(r.id)) relation = "Родитель";
      if (childIds.includes(r.id)) relation = "Ребёнок";
      if (spouseId.includes(r.id)) relation = "Супруг/Супруга";
      return { ...r, relation };
    });

    res.json({
      ...citizen,
      relatives: enrichedRelatives,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch citizen" });
  }
});

app.get("/companies", async (req, res) => {
  const companies = await db("companies").select("id", "name");
  res.json(companies);
});

app.get("/schools", async (req, res) => {
  const schools = await db("schools").select("id", "name");
  res.json(schools);
});

app.get("/universities", async (req, res) => {
  const universities = await db("universities").select("id", "name");
  res.json(universities);
});



app.listen(3001, () => console.log("Backend running on port 3001"));
