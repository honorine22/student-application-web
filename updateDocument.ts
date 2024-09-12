import { client } from "./sanity/lib/client";


// Define the document ID and the updated data
const documentId = 'KzS6kYoWzDJY07Cgj9VRkD'; // Replace with your document ID
const updatedDocument = {
  _id: documentId,
  _type: 'studentAdmission', // Replace with your document type
  // Add your fields here
  status: 'approved', // Example field
  email: 'igiranezah8@gmail.com' // Example field
};

// Update the document
client
  .patch(documentId) // Document ID to patch
  .set(updatedDocument) // Shallow merge
  .commit()
  .then((updated) => {
    console.log('Document updated:', updated);
  })
  .catch((err) => {
    console.error('Error updating document:', err.message);
  });
