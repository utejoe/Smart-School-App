import * as SQLite from 'expo-sqlite';
);`
);
});
}


export function upsertStudents(rows: any[]) {
db.transaction((tx) => {
rows.forEach((s) => {
tx.executeSql(
`INSERT OR REPLACE INTO students (id, firstName, lastName, admissionNumber, classId, className)
VALUES (?, ?, ?, ?, ?, ?);`,
[
s.id,
s.firstName,
s.lastName,
s.admissionNumber,
s.schoolClass?.id ?? null,
s.schoolClass?.name ?? null,
]
);
});
});
}


export function getStudentsLocal(): Promise<any[]> {
return new Promise((resolve, reject) => {
db.transaction((tx) => {
tx.executeSql(
'SELECT * FROM students ORDER BY lastName ASC;',
[],
(_, { rows }) => resolve(rows._array || []),
(_, err) => {
reject(err);
return true;
}
);
});
});
}


export function enqueue(method: string, url: string, body?: any) {
db.transaction((tx) => {
tx.executeSql(
`INSERT INTO sync_queue (method, url, body, createdAt) VALUES (?, ?, ?, ?);`,
[method, url, body ? JSON.stringify(body) : null, Date.now()]
);
});
}


export function dequeueBatch(limit = 10): Promise<any[]> {
return new Promise((resolve, reject) => {
db.transaction((tx) => {
tx.executeSql(
`SELECT * FROM sync_queue ORDER BY createdAt ASC LIMIT ?;`,
[limit],
(_, { rows }) => resolve(rows._array || []),
(_, err) => {
reject(err);
return true;
}
);
});
});
}


export function removeFromQueue(ids: number[]) {
if (!ids.length) return;
const marks = ids.map(() => '?').join(',');
db.transaction((tx) => {
tx.executeSql(`DELETE FROM sync_queue WHERE id IN (${marks});`, ids as any);
});
}