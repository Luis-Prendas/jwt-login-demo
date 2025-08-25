import request from "supertest";
import app from "../src/app";

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