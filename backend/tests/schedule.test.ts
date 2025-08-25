import request from "supertest";
import app from "../src/app";

describe("Auth - /api/schedule/getSchedule/:id", () => {
  it("debe devolver 404 si no se encuentra el horario", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .get("/api/schedule/getSchedule/999")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("No se encontró ningún horario");
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const res = await request(app)
      .get("/api/schedule/getSchedule/999")
      .send();

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token no proporcionado");
  });

  it("debe devolver 200 y el horario del usuario", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const res = await request(app)
      .get("/api/schedule/getSchedule/a001")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});