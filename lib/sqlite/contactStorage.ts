import { ContactType } from "@/types/Contacts";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("messages.db");

// Create the contacts table
export function createContactsTable() {
  db.withTransactionSync(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY NOT NULL,
        createdAt TEXT,
        userId1 TEXT,
        userId2 TEXT,
        user1Name TEXT,
        user2Name TEXT
      );
    `);

    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_contacts_lookup 
      ON contacts(userId1, userId2);
    `);
  });
}



export function saveContactsToDB(contacts: ContactType[]) {
  db.withTransactionSync(() => {
    for (const contact of contacts) {
      const stmt = db.prepareSync(`
        INSERT OR REPLACE INTO contacts (
          id, createdAt, userId1, userId2, user1Name, user2Name
        ) VALUES (?, ?, ?, ?, ?, ?);
      `);

      stmt.executeSync([
        contact.id,
        contact.createdAt,
        contact.userId1,
        contact.userId2,
        contact.user1.name,
        contact.user2.name,
      ]);

      stmt.finalizeSync();
    }
  });
}


export function loadContactsFromDB(): ContactType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM contacts ORDER BY createdAt DESC;
  `);

  const results = stmt.executeSync();
  const rows = results.getAllSync();
  stmt.finalizeSync();
  return rows.map((row: any) => ({
      id: row.id,
      createdAt: row.createdAt,
      userId1: row.userId1,
      userId2: row.userId2,
      user1: { name: row.user1Name },
      user2: { name: row.user2Name },
    }));
}


export function deleteAllContacts() {
  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`DELETE FROM contacts;`);
    stmt.executeSync();
    stmt.finalizeSync();
  });
}
