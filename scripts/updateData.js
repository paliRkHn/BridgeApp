const admin = require('firebase-admin');

// --- IMPORTANT: Service Account Key Setup ---
const serviceAccount = require('./bridge-app-02-firebase-adminsdk-fbsvc-0c54cb90df.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your fields to add to each document
const fieldsToAdd = {
  "hoursWeekly": "25h",
  "breakTimes": "2 x 10 min break, 30 min lunch break",
  "flexibleHours": true,
  "involvesCustomerService": false,
  "teamWorkSize": "8 people",
  "companySize": "60-90 workers",
  "dressCode": "Uniform"
};

async function updateAllDocuments(collectionName) {
  try {
    // Get all documents from the collection using Admin SDK
    console.log('Fetching documents...');
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    const totalDocs = snapshot.size;
    console.log(`Found ${totalDocs} documents to update`);
    
    if (totalDocs === 0) {
      console.log('No documents found to update');
      return;
    }
    
    // Admin SDK batch limit is 500, using smaller batches for safety
    const batchSize = 100;
    const batches = [];
    let currentBatch = db.batch();
    let operationCount = 0;
    
    snapshot.forEach((doc) => {
      currentBatch.update(doc.ref, fieldsToAdd);
      operationCount++;
      
      // If we've hit the batch size limit, start a new batch
      if (operationCount === batchSize) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        operationCount = 0;
      }
    });
    
    // Add the remaining operations to the last batch
    if (operationCount > 0) {
      batches.push(currentBatch);
    }
    
    // Execute all batches
    console.log(`Executing ${batches.length} batch(es)...`);
    for (let i = 0; i < batches.length; i++) {
      console.log(`Committing batch ${i + 1}/${batches.length}...`);
      await batches[i].commit();
    }
    
    console.log(`✅ Successfully updated ${totalDocs} documents!`);
    console.log('Added fields:', Object.keys(fieldsToAdd));
    
    return { success: true, updatedCount: totalDocs };
    
  } catch (error) {
    console.error('❌ Error updating documents:', error);
    throw error;
  }
}

async function updateData() {
  const collectionName = 'jobs'; // Change to your collection name 

  console.log('Starting bulk field update to Firestore...');
  
  try {
    const result = await updateAllDocuments(collectionName);
    console.log('\nUpdate completed successfully!');
    console.log(`Updated ${result.updatedCount} documents in the '${collectionName}' collection.`);
  } catch (error) {
    console.error('Update failed:', error);
  }
}

async function testUpdate() {
    const collectionRef = db.collection('jobs');
    const snapshot = await collectionRef.limit(2).get(); // Test on 2 documents
    
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, fieldsToAdd);
    });
    
    await batch.commit();
    console.log(`✅ Test completed: Updated ${snapshot.size} documents`);
    
    // Show what was added
    console.log('Fields added:', Object.keys(fieldsToAdd));
  }

// Uncomment to test
//testUpdate().catch(console.error);  

// Run the update - uncomment the line below when ready
//updateData().catch(console.error);

module.exports = { updateAllDocuments, fieldsToAdd };