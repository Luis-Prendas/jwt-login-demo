import request from "supertest";
import app from "../src/app";
import { initDB } from "../src/db/db";

describe("Auth - /api/session/login", () => {
  it("debe devolver 400 si faltan campos", async () => {
    const res = await request(app)
      .post("/api/session/login")
      .send({ username: "az" }); // falta password

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Usuario y contraseña son obligatorios.");
  });

  it("debe devolver 401 si usuario no existe", async () => {
    const res = await request(app)
      .post("/api/session/login")
      .send({ username: "noexiste", password: "noexiste" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Credenciales inválidas.");
  });

  it("debe devolver 200 y un token si login es correcto", async () => {
    const res = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });
});

describe("Auth - /api/session/register", () => {
  beforeAll(async () => {
    const db = await initDB();
    // Limpieza de usuarios con el mismo correo o username de prueba
    await db.run(`DELETE FROM user WHERE username = ? OR email = ?`, [
      "testuser",
      "testuser@test.com",
    ]);
  });

  it("debe devolver 400 si faltan campos", async () => {
    const res = await request(app)
      .post("/api/session/register")
      .send({ username: "nuevo" }); // falta email y password

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Nombre de usuario, email y contraseña son obligatorios."
    );
  });

  it("debe devolver 409 si el usuario ya existe", async () => {
    const res = await request(app)
      .post("/api/session/register")
      .send({ username: "az", email: "testuser@test.com", password: "123456789" });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error", "Usuario o email ya existente.");

  });

  it("debe devolver 200 y un token si registro es exitoso", async () => {
    const res = await request(app)
      .post("/api/session/register")
      .send({ username: "testuser", email: "testuser@test.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});