const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Trigger on report creation -> Run AI validation
exports.validateCitizenReport = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const reportData = snap.data();
    
    // ------------------------------------------------------------------------
    // MOCK AI LOGIC: In a real app, you would pass reportData.image_url 
    // and reportData.description to Genkit / OpenAI / Vertex AI for validation.
    // Here we simulate an AI determination:
    // ------------------------------------------------------------------------
    
    // Simulate API call processing time
    const isAiVerified = Math.random() > 0.2; // 80% pass rate for demo
    
    return snap.ref.set({
      ai_verified: isAiVerified,
      ai_validation_timestamp: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
});

// Trigger on project update -> Run reality check logic
exports.realityCheckEngine = functions.firestore
  .document('projects/{projectId}')
  .onUpdate(async (change, context) => {
    const newProject = change.after.data();
    const projectId = context.params.projectId;

    if (newProject.status === 'completed') {
      // Fetch related complaints
      const complaintsSnap = await admin.firestore().collection('reports')
        .where('project_id', '==', projectId)
        .where('status', '==', 'submitted')
        .get();

      const complaintCount = complaintsSnap.size;
      const threshold = 3; // Example threshold

      if (complaintCount > threshold) {
        // AI Logic: High discrepancy between "completed" status and public reports
        const newScore = Math.max(0, (newProject.ai_reality_score || 100) - 20);
        
        return change.after.ref.update({
          ai_reality_score: newScore,
          flagged_issue: 'Mismatch Detected: High complaint volume for completed project',
        });
      }
    }
    return null;
});

// Scheduled function: fetch AQI API every 5 minutes
exports.fetchAQI = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  // ------------------------------------------------------------------------
  // MOCK AQI LOGIC: Integrate with an actual AQI API here.
  // We'll update a central 'city_stats' document for the demo.
  // ------------------------------------------------------------------------
  
  const mockAqiValue = Math.floor(Math.random() * (200 - 50 + 1) + 50);
  
  return admin.firestore().collection('cities').doc('demo-city').set({
    aqi: mockAqiValue,
    last_updated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
});
