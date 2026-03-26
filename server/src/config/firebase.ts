import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

import path from 'path';
import fs from 'fs';

let firebaseConfig: any;

const serviceAccountPath = path.resolve(__dirname, '../../serviceAccount.json');

if (fs.existsSync(serviceAccountPath)) {
    try {
        console.log('📖 Loading Firebase service account from file:', serviceAccountPath);
        firebaseConfig = require(serviceAccountPath);
    } catch (e: any) {
        console.error('❌ Failed to load serviceAccount.json:', e.message);
    }
}

if (!firebaseConfig) {
    const getPrivateKey = () => {
        let key = process.env.FIREBASE_PRIVATE_KEY || '';
        // Strip quotes if they were included by dotenv from file
        key = key.replace(/^["']|["']$/g, '');
        // Handle literal \n and real newlines
        key = key.replace(/\\n/g, '\n');
        // Final sanity check for PEM format
        if (key && !key.startsWith('-----BEGIN PRIVATE KEY-----')) {
            key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
        }
        return key;
    };

    firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
    };
}

// Check if critical variables are present
const hasConfig = (firebaseConfig.projectId || firebaseConfig.project_id) && 
                  (firebaseConfig.clientEmail || firebaseConfig.client_email) && 
                  (firebaseConfig.privateKey || firebaseConfig.private_key);

if (!hasConfig) {
    console.error('❌ CRITICAL: Missing Firebase configuration details!');
}

if (!admin.apps.length) {
    try {
        console.log('⏳ Attempting Firebase Admin initialization...');
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });
        console.log('✅ Firebase Admin Initialized Successfully for project:', admin.app().options.projectId);
    } catch (error: any) {
        console.error('❌ CRITICAL: Firebase Admin Initialization Error:', error.message);
    }
}

import { getFirestore } from 'firebase-admin/firestore';

// These are initialized ONLY if app exists
const isAppInit = admin.apps.length > 0;
// Using specific database ID requested by user
export const db = isAppInit ? getFirestore(admin.app(), 'prayerrealms') : null as unknown as admin.firestore.Firestore;
export const auth = isAppInit ? admin.auth() : null as unknown as admin.auth.Auth;
export const storage = isAppInit ? admin.storage() : null as unknown as admin.storage.Storage;

export default admin;
