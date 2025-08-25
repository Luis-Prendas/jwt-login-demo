import request from "supertest";
import app from "../src/app";

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
