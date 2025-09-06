import NetInfo from '@react-native-community/netinfo'; // (optional) if you add it later
import { api } from './api';
import { dequeueBatch, removeFromQueue } from './offlineDB';


export async function processQueueOnce() {
try {
const batch = await dequeueBatch(15);
if (!batch.length) return;


const succeedIds: number[] = [];


for (const item of batch) {
const { id, method, url, body } = item;
try {
const data = body ? JSON.parse(body) : undefined;
// api already has baseURL '/api'
await api.request({ method, url, data });
succeedIds.push(id);
} catch (e) {
// stop on first failure to preserve order
break;
}
}


removeFromQueue(succeedIds);
} catch (err) {
// swallow; try again later
}
}