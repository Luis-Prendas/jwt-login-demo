import { initDB } from "./src/db/db";
import { DB } from "./src/db/mockDB";

/**
 * Seed de la base de datos.
 * Cada vez que se ejecuta, elimina los datos anteriores y carga los iniciales.
 */
export async function seedDatabase() {
  const db = await initDB();

  // Limpiar tablas
  await db.exec('DELETE FROM users');
  await db.exec('DELETE FROM rooms');
  await db.exec('DELETE FROM tabsMenuOptions');

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

  // Insertar salas
  for (const room of DB.rooms) {
    await db.run(
      `INSERT INTO rooms (uuid, name, capacity)
       VALUES (?, ?, ?)`,
      [room.uuid, room.name, room.capacity]
    );
  }

  // Insertar opciones de menú/tab
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
        JSON.stringify(tab.rolesAllowed) // guardamos array como texto
      ]
    );
  }

  console.log('✅ Base de datos inicializada con datos de ejemplo.');
}

// Ejecutar seed automáticamente si se corre el script directamente
if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('❌ Error al inicializar la base de datos:', err);
  });
}
