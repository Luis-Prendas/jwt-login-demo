import request from "supertest";
import app from "../src/app";

describe("Attendance - /api/attendance/getAttendance/:userId/:date", () => {
  it("debe devolver 404 si no se encuentra la asistencia", async () => {
    const loginRes = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const token = loginRes.body.token;

    // Fecha que no existe en el seed
    const date = "2025-08-25"; // solo YYYY-MM-DD

    const res = await request(app)
      .get(`/api/attendance/getAttendance/a001/${date}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Asistencia no encontrada");
  });

  it("debe devolver 401 si no se proporciona un token", async () => {
    const date = "2023-03-04"; // ejemplo
    const res = await request(app)
      .get(`/api/attendance/getAttendance/a001/${date}`)
      .send();

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token no proporcionado");
  });

  it("debe devolver 200 y la asistencia del usuario", async () => {
    const loginRes = await request(app)
      .post("/api/session/login")
      .send({ username: "az", password: "az" });

    const token = loginRes.body.token;

    // Fecha que sí existe en el seed
    const date = "2023-03-04"; // solo YYYY-MM-DD

    const res = await request(app)
      .get(`/api/attendance/getAttendance/a001/${date}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("attendance");
    expect(res.body.attendance.userId).toBe("a001");
  });
});
