// Minimal IndexedDB wrapper for storing interview recordings locally
// Object store: "clips" with key auto-increment. Indexes: interviewId, type
const DB_NAME = "intervyo-recordings";
const DB_VERSION = 1;
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("clips")) {
        const store = db.createObjectStore("clips", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("interviewId", "interviewId", { unique: false });
        store.createIndex("type", "type", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("clips", mode);
    const store = tx.objectStore("clips");
    const result = fn(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function saveClip(clip) {
  // clip: { interviewId, type: 'camera'|'screen', questionIndex, transcript?, metrics?, blob }
  const entry = {
    interviewId: clip.interviewId,
    type: clip.type,
    questionIndex:
      typeof clip.questionIndex === "number" ? clip.questionIndex : null,
    transcript: clip.transcript || "",
    metrics: clip.metrics || null,
    createdAt: Date.now(),
    // Store blob in separate field to avoid cloning issues
    blob: clip.blob,
    filename:
      clip.filename ||
      `${clip.type}-q${clip.questionIndex ?? "na"}-${Date.now()}.webm`,
    mimeType: clip.mimeType || "video/webm",
  };
  return withStore("readwrite", (store) => store.add(entry));
}

export async function listClipsByInterview(interviewId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("clips", "readonly");
    const store = tx.objectStore("clips");
    const idx = store.index("interviewId");
    const request = idx.getAll(IDBKeyRange.only(interviewId));
    request.onsuccess = () => {
      const clips = request.result.sort((a, b) => a.createdAt - b.createdAt);
      resolve(clips);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function listAllInterviewsWithCounts() {
  // Returns [{ interviewId, count }]
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("clips", "readonly");
    const store = tx.objectStore("clips");
    const result = new Map();
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        const { interviewId } = cursor.value;
        result.set(interviewId, (result.get(interviewId) || 0) + 1);
        cursor.continue();
      } else {
        resolve(
          Array.from(result.entries()).map(([interviewId, count]) => ({
            interviewId,
            count,
          })),
        );
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

export async function getClip(id) {
  return withStore("readonly", (store) => store.get(id));
}

export async function deleteClip(id) {
  return withStore("readwrite", (store) => store.delete(id));
}

export function blobToObjectUrl(blob) {
  return URL.createObjectURL(blob);
}

export function downloadClip(clip) {
  const url = blobToObjectUrl(clip.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = clip.filename || `recording-${clip.id}.webm`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
