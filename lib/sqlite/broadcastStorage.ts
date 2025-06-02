import { messageType } from "@/types/Message";
import * as SQLite from "expo-sqlite";

// Open the database synchronously
const db = SQLite.openDatabaseSync("messages.db");

// Create the messages table if it doesn't exist
export function createMessagesTable() {
  db.withTransactionSync(() => {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT,
        toUserId TEXT,
        userId TEXT,
        text TEXT,
        orderNo INTEGER,
        serialNo INTEGER,
        createdAt TEXT,
        isSent INTEGER,
        username TEXT
      );`
    );

    db.execSync(
      `CREATE INDEX IF NOT EXISTS idx_messages_lookup 
       ON messages(type, userId, toUserId, serialNo);`
    );
  });
}

export function saveMessagesToDB(
  type: string,
  toUserId: string | undefined,
  messages: messageType[]
) {
  db.withTransactionSync(() => {
    for (const msg of messages) {
      const stmt = db.prepareSync(`
        INSERT OR REPLACE INTO messages (
          id, type, toUserId, userId, text, orderNo, serialNo, createdAt, isSent, username
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);
      stmt.executeSync([
        msg.id,
        type,
        toUserId || "",
        msg.userId,
        msg.text,
        msg.orderNo,
        msg.serialNo,
        msg.createdAt,
        msg.isSent ? 1 : 0,
        msg.username,
      ]);
      stmt.finalizeSync();
    }
  });
}

export function loadMessagesFromDB(
  limit: number = 200,
  type: string
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM messages
    Where type = ?
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([type, limit]);

  const rows = results.getAllSync();
  stmt.finalizeSync();

  return rows.map((msg: any) => ({
    id: msg.id,
    type: msg.type,
    toUserId: msg.toUserId,
    userId: msg.userId,
    text: msg.text,
    orderNo: msg.orderNo,
    serialNo: msg.serialNo,
    createdAt: msg.createdAt,
    isSent: !!msg.isSent,
    username: msg.username,
  }));
}

export function getLastSerialNoFromDB(
  type: string
): number {
  const stmt = db.prepareSync(`
    SELECT MAX(serialNo) as maxSerialNo FROM messages
    Where type = ?;
  `);

  const results = stmt.executeSync([type]);

  const rows = results.getAllSync() as { maxSerialNo: number }[];
  stmt.finalizeSync();
  return rows[0]?.maxSerialNo || 0;
}

// Load older messages from DB based on serialNo
export function loadOlderMessagesFromDB(
  type: string,
  beforeSerialNo: number,
  limit: number
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM messages
    WHERE(
      type = ? AND
      serialNo < ?
    )
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([
    type,
    beforeSerialNo,
    limit,
  ]);

  const rows = results.getAllSync();
  stmt.finalizeSync();

  return rows.map((msg: any) => ({
    id: msg.id,
    type: msg.type,
    toUserId: msg.toUserId,
    userId: msg.userId,
    text: msg.text,
    orderNo: msg.orderNo,
    serialNo: msg.serialNo,
    createdAt: msg.createdAt,
    isSent: !!msg.isSent,
    username: msg.username,
  }));
}

// Load older messages from DB based on serialNo
export function loadNewerMessagesFromDB(
  type: string,
  afterSerialNo: number,
  limit: number
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM messages
    WHERE(
      type = ? AND
      serialNo > ?
    )
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([
    type,
    afterSerialNo,
    limit,
  ]);

  const rows = results.getAllSync();
  stmt.finalizeSync();

  return rows.map((msg: any) => ({
    id: msg.id,
    type: msg.type,
    toUserId: msg.toUserId,
    userId: msg.userId,
    text: msg.text,
    orderNo: msg.orderNo,
    serialNo: msg.serialNo,
    createdAt: msg.createdAt,
    isSent: !!msg.isSent,
    username: msg.username,
  }));
}

// Get total count of messages in DB
export function getTotalMessagesCount(
  type: string
): number {
  const stmt = db.prepareSync(`
    SELECT COUNT(*) as count FROM messages
    WHERE type = ?
  `);

  const results = stmt.executeSync([type]);

  const rows = results.getAllSync() as { count: number }[];
  stmt.finalizeSync();
  return rows[0]?.count || 0;
}

// Delete old messages to prevent database bloat
export function deleteOldMessages(
  type: string,
  userId: string,
  toUserId: string | undefined,
  keepCount: number = 1000
) {
  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`
      DELETE FROM messages 
      WHERE (
        type IN ('Anonymous', 'Reveal')
      )
      AND id NOT IN (
        SELECT id FROM messages 
        WHERE (
          type IN ('Anonymous', 'Reveal')
        )
        ORDER BY serialNo DESC 
        LIMIT ?
      );
    `);

    const params = [
      keepCount,
    ];
    stmt.executeSync(params);
    stmt.finalizeSync();
  });
}

// Get message statistics for debugging
export function getMessageStats(
  type: string,
  userId: string,
  toUserId: string | undefined
) {
  const stmt = db.prepareSync(`
    SELECT 
      COUNT(*) as totalCount,
      MIN(serialNo) as minSerialNo,
      MAX(serialNo) as maxSerialNo,
      MIN(createdAt) as oldestMessage,
      MAX(createdAt) as newestMessage
    FROM messages
    WHERE (
      type IN ('Anonymous', 'Reveal')
    );
  `);

  const results = stmt.executeSync();

  const rows = results.getAllSync();
  stmt.finalizeSync();
  return rows[0] || {};
}

export function deleteEverything(
) {
  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`
      DELETE FROM messages;
    `);

    stmt.executeSync();
    stmt.finalizeSync();
  });
}