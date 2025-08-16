import { initDB } from "./src/db/db";
import { DB } from "./src/db/mockDB";

(async () => {
  const db = await initDB();

  // Limpiar tablas
  await db.exec("DELETE FROM users");
  await db.exec("DELETE FROM rooms");
  await db.exec("DELETE FROM tabsMenuOptions");

  // Insertar usuarios
  for (const user of DB.users) {
    await db.run(
      `INSERT INTO users 
       (uuid, email, username, password, nickname, role, rafflePoints)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.uuid,
        user.email,
        user.username,
        user.password,
        user.nickname,
        user.role,
        user.balance.rafflePoints
      ]
    );
  }

  // Insertar rooms
  for (const room of DB.rooms) {
    await db.run(
      `INSERT INTO rooms (uuid, name, capacity)
       VALUES (?, ?, ?)`,
      [room.uuid, room.name, room.capacity]
    );
  }

  // Insertar tabsMenuOptions
  for (const tab of DB.tabsMenuOptions) {
    await db.run(
      `INSERT INTO tabsMenuOptions 
       (uuid, label, icon, route, authRequired, "order", rolesAllowed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tab.uuid,
        tab.label,
        tab.icon,
        tab.route,
        tab.authRequired ? 1 : 0,
        tab.order,
        JSON.stringify(tab.rolesAllowed)
      ]
    );
  }

  console.log("✅ Base de datos reiniciada con datos iniciales.");
})();
