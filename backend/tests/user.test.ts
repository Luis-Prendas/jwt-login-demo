import request from "supertest";
import app from "../src/app";
import { initDB } from "../src/db/db";

describe("Auth - /api/user/getUser/:id", () => {
  it("debe devolver 404 si no se encuentra el usuario", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .get("/api/user/getUser/999")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Usuario no encontrado");
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const res = await request(app)
      .get("/api/user/getUser/999")
      .send();

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Token no proporcionado");
  });

  it("debe devolver 200 y la información del usuario si se proporciona un token válido", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .get("/api/user/getUser/a001")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });
});

describe("Auth - /api/user/getAllUsers", () => {
  it("debe devolver 200 y un array con todos los usuarios", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .get("/api/user/getAllUsers")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const res = await request(app)
      .get("/api/user/getAllUsers")
      .send();

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Token no proporcionado");
  });
});

describe("Auth - /api/user/updateUser/:id", () => {
  beforeEach(async () => {
    const db = await initDB();
    // Eliminar si ya existía
    await db.run("DELETE FROM user WHERE id = ?", ["9999"]);
    await db.run("DELETE FROM user WHERE username = ?", ["testuser"]);

    // Insertar usuario base
    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, role, description, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "9999",
        "testuser@test.com",
        "testuser",
        "testuser",
        "testuser",
        "user",
        "testuser",
        new Date(),
        new Date(),
        0,
      ]
    );
  });

  it("debe devolver 404 si no se encuentra el usuario", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .put("/api/user/updateUser/000")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send({
        username: "testuserEDIT",
        email: "nuevo@email.com",
        nickname: "nuevoNickname",
        role: "moderador",
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Usuario no encontrado");
  });

  it("debe devolver 400 si no se proporcionan datos válidos", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .put(`/api/user/updateUser/9999`)
      .set("Authorization", `Bearer ${token.body.token}`)
      .send({ email: "nuevo@email.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "ID de usuario o datos de usuario no proporcionados"
    );
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const res = await request(app)
      .put("/api/user/updateUser/999")
      .send({
        username: "testuserEDIT",
        email: "nuevo@email.com",
        nickname: "nuevoNickname",
        role: "moderador",
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Token no proporcionado");
  });

  it("debe devolver 200 y un booleano indicando éxito", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .put(`/api/user/updateUser/9999`)
      .set("Authorization", `Bearer ${token.body.token}`)
      .send({ username: "123", email: "nuevo@email.com", nickname: "123", role: "moderador" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  afterEach(async () => {
    const db = await initDB();
    await db.run("DELETE FROM user WHERE id = ?", ["9999"]);
  });
});

describe("Auth - /api/user/deleteUser/:id", () => {
  beforeEach(async () => {
    const db = await initDB();
    // Eliminar si ya existía
    await db.run("DELETE FROM user WHERE id = ?", ["9999"]);
    await db.run("DELETE FROM user WHERE username = ?", ["testuser"]);

    // Insertar usuario base
    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, role, description, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "9999",
        "testuser@test.com",
        "testuser",
        "testuser",
        "testuser",
        "user",
        "testuser",
        new Date(),
        new Date(),
        0,
      ]
    );
  });

  it("debe devolver 404 si no se encuentra el usuario", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .delete("/api/user/deleteUser/000")
      .set("Authorization", `Bearer ${token.body.token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Usuario no encontrado");
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const res = await request(app)
      .delete("/api/user/deleteUser/9999");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Token no proporcionado");
  });

  it("debe devolver 200 y un booleano indicando éxito", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .delete(`/api/user/deleteUser/9999`)
      .set("Authorization", `Bearer ${token.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  afterEach(async () => {
    const db = await initDB();
    await db.run("DELETE FROM user WHERE id = ?", ["9999"]);
  });
});