import request from "supertest";
import app from "../src/app";

describe("Auth - /api/badge/getUserBadges/:id", () => {
  it("debe devolver 404 si no se encuentra la insignia", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const response = await request(app)
      .get("/api/badge/getUserBadges/zzz")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No se encontraron insignias para este usuario.");
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const response = await request(app)
      .get("/api/badge/getUserBadges/999")
      .send();

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token no proporcionado");
  });

  it("debe devolver 200 si se encuentra la insignia", async () => {
    const token = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const response = await request(app)
      .get("/api/badge/getUserBadges/a001")
      .set("Authorization", `Bearer ${token.body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.badges)).toBe(true);
  });
});