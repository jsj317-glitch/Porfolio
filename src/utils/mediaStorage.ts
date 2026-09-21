import { Project } from '../types';

const DB_NAME = 'SeonjeongPortfolioDB';
const DB_VERSION = 1;
const MEDIA_STORE = 'mediaFiles';
const APP_DATA_STORE = 'appData';

export interface StoredMedia {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

// In-memory cache of resolved Object URLs: 'idb://{id}' -> 'blob:...'
const mediaObjectUrlCache = new Map<string, string>();

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(APP_DATA_STORE)) {
        db.createObjectStore(APP_DATA_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Initialize storage by preloading all stored Blobs into active Object URLs.
 * Call this during App mount.
 */
export async function initMediaStorage(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(MEDIA_STORE, 'readonly');
    const store = tx.objectStore(MEDIA_STORE);
    const getAllRequest = store.getAll();

    return new Promise((resolve) => {
      getAllRequest.onsuccess = () => {
        const records: StoredMedia[] = getAllRequest.result || [];
        for (const record of records) {
          if (record.blob) {
            const idbKey = `idb://${record.id}`;
            // Revoke old if exists
            if (mediaObjectUrlCache.has(idbKey)) {
              URL.revokeObjectURL(mediaObjectUrlCache.get(idbKey)!);
            }
            const objectUrl = URL.createObjectURL(record.blob);
            mediaObjectUrlCache.set(idbKey, objectUrl);
          }
        }
        resolve();
      };
      getAllRequest.onerror = () => {
        console.warn('Could not read media files from IndexedDB:', getAllRequest.error);
        resolve();
      };
    });
  } catch (err) {
    console.warn('initMediaStorage error:', err);
  }
}

/**
 * Save an uploaded local File (Image or Video) into IndexedDB.
 * Returns the permanent idb:// reference and its immediate live Object URL.
 */
export async function saveUploadedFile(
  file: File
): Promise<{
  url: string;
  objectUrl: string;
  mediaType: 'image' | 'video';
  name: string;
  size: number;
}> {
  const isVideo =
    file.type.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);

  const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const idbKey = `idb://${id}`;

  const record: StoredMedia = {
    id,
    name: file.name,
    type: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
    size: file.size,
    blob: file,
    createdAt: Date.now(),
  };

  // Immediate object URL for instant preview
  const liveObjectUrl = URL.createObjectURL(file);
  mediaObjectUrlCache.set(idbKey, liveObjectUrl);

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('Failed to store media in IndexedDB, fallback to live URL:', e);
  }

  return {
    url: idbKey,
    objectUrl: liveObjectUrl,
    mediaType,
    name: file.name,
    size: file.size,
  };
}

/**
 * Synchronously resolve a media URL.
 * If it's an 'idb://...' URL, it returns the cached Object URL.
 * Otherwise returns the URL as-is (https://, data:, etc.)
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('idb://')) {
    return mediaObjectUrlCache.get(url) || url;
  }
  return url;
}

/**
 * Save project list persistently to IndexedDB and sync to localStorage.
 */
export async function saveProjectsPersistently(projects: Project[]): Promise<void> {
  // Sync to localStorage
  try {
    localStorage.setItem('seonjeong_jeon_portfolio_v1', JSON.stringify(projects));
  } catch (err) {
    console.warn('LocalStorage quota might be full, saving exclusively to IndexedDB:', err);
  }

  // Save to IndexedDB
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(APP_DATA_STORE, 'readwrite');
      const store = tx.objectStore(APP_DATA_STORE);
      const req = store.put({ key: 'projects', data: projects, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save projects to IndexedDB:', err);
  }
}

/**
 * Load project list from IndexedDB first, then localStorage.
 */
export async function loadProjectsPersistently(): Promise<Project[] | null> {
  // Try IndexedDB first
  try {
    const db = await getDB();
    const projectRecord = await new Promise<{ key: string; data: Project[] } | undefined>(
      (resolve) => {
        const tx = db.transaction(APP_DATA_STORE, 'readonly');
        const store = tx.objectStore(APP_DATA_STORE);
        const req = store.get('projects');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(undefined);
      }
    );

    if (projectRecord && Array.isArray(projectRecord.data) && projectRecord.data.length > 0) {
      return projectRecord.data;
    }
  } catch (e) {
    console.warn('IndexedDB read failed, falling back to localStorage', e);
  }

  // Fallback to localStorage
  try {
    const saved = localStorage.getItem('seonjeong_jeon_portfolio_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage read failed', e);
  }

  return null;
}

/**
 * Format bytes to readable human size (KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
