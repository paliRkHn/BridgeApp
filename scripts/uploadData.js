const admin = require('firebase-admin');

// --- IMPORTANT: Service Account Key Setup ---
// Before running this script, you MUST download your Service Account Key.
// Go to your Firebase project settings (Project settings > Service accounts).
// Click "Generate new private key" and download the JSON file.
// Store it securely and update the path below.
// For security, do NOT commit this file to public repositories!
const serviceAccount = require('./bridge-app-02-firebase-adminsdk-fbsvc-0c54cb90df.json'); // <--- UPDATE THIS PATH

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  const collectionRef = db.collection('categories'); // Change name of collection, will create if not in database

  console.log('Starting data upload to Firestore...');
  let uploadedCount = 0;

  // Change path to data file
  for (const job of require('../data/categoriesData.json').categories) {
    try {
      // Add each job object as a new document. Firestore will auto-generate the ID.
      await collectionRef.add(job);
      uploadedCount++;
      console.log(`Uploaded job: "${job.title}"`);
    } catch (error) {
      console.error(`Error uploading job "${job.title}":`, error);
    }
  }

  console.log(`\nFinished! Successfully uploaded ${uploadedCount} job documents to the 'jobs' collection.`);
}

uploadData().catch(console.error);