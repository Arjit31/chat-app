import { messageType } from "@/types/Message";
import * as SQLite from "expo-sqlite";

// Open the database synchronously
const db = SQLite.openDatabaseSync("messages.db");

// Create the messages table if it doesn't exist
export function createMessagesTableUnicast() {
  db.withTransactionSync(() => {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS unicast_messages (
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
       ON unicast_messages(type, userId, toUserId, serialNo);`
    );
  });
}

export function saveMessagesToDBUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined,
  messages: messageType[]
) {
  db.withTransactionSync(() => {
    for (const msg of messages) {
      const stmt = db.prepareSync(`
        INSERT OR REPLACE INTO unicast_messages (
          id, type, toUserId, userId, text, orderNo, serialNo, createdAt, isSent, username
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);
      stmt.executeSync([
        msg.id,
        type,
        msg.isSent ? toUserId || "" : userId,
        msg.isSent ? userId : toUserId || "",
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

export function loadMessagesFromDBUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined,
  limit: number = 200
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM unicast_messages
    WHERE (
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
    )
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",
    toUserId || "",
    userId,
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

export function getLastSerialNoFromDBUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined
): number {
  const stmt = db.prepareSync(`
    SELECT MAX(serialNo) as maxSerialNo FROM unicast_messages
    WHERE (
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
    );
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",
    toUserId || "",
    userId,
  ]);

  const rows = results.getAllSync() as { maxSerialNo: number }[];
  stmt.finalizeSync();
  return rows[0]?.maxSerialNo || 0;
}

// Load older messages from DB based on serialNo
export function loadOlderMessagesFromDBUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined,
  beforeSerialNo: number,
  limit: number
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM unicast_messages
    WHERE(
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
      AND serialNo < ?
    )
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",

    toUserId || "",
    userId,
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
export function loadNewerMessagesFromDBUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined,
  afterSerialNo: number,
  limit: number
): messageType[] {
  const stmt = db.prepareSync(`
    SELECT * FROM unicast_messages
    WHERE(
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
      AND serialNo > ?
    )
    ORDER BY serialNo DESC
    LIMIT ?;
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",

    toUserId || "",
    userId,
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
export function getTotalMessagesCountUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined
): number {
  const stmt = db.prepareSync(`
    SELECT COUNT(*) as count FROM unicast_messages
    WHERE (
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
    );
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",
    toUserId || "",
    userId,
  ]);

  const rows = results.getAllSync() as { count: number }[];
  stmt.finalizeSync();
  return rows[0]?.count || 0;
}

// Delete old messages to prevent database bloat
export function deleteOldMessagesUnicast(
  type: string,
  userId: string,
  toUserId: string | undefined,
  keepCount: number = 1000
) {
  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`
      DELETE FROM unicast_messages 
      WHERE (
        type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
      )
      AND id NOT IN (
        SELECT id FROM unicast_messages 
        WHERE (
          type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
        )
        ORDER BY serialNo DESC 
        LIMIT ?
      );
    `);

    const params = [
      type,
      userId,
      toUserId || "",
      toUserId || "",
      userId,
      type,
      userId,
      toUserId || "",
      toUserId || "",
      userId,
      keepCount,
    ];
    stmt.executeSync(params);
    stmt.finalizeSync();
  });
}

// Get message statistics for debugging
export function getMessageStatsUnicast(
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
    FROM unicast_messages
    WHERE (
      type = ? AND ((userId = ? AND toUserId = ?) OR (userId = ? AND toUserId = ?))
    );
  `);

  const results = stmt.executeSync([
    type,
    userId,
    toUserId || "",
    toUserId || "",
    userId,
  ]);

  const rows = results.getAllSync();
  stmt.finalizeSync();
  return rows[0] || {};
}


export function deleteEverythingUnicast(
) {
  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`
      DELETE FROM unicast_messages;
    `);

    stmt.executeSync();
    stmt.finalizeSync();
  });
}