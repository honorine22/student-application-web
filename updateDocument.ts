import { client } from "./sanity/lib/client";

const mailReceiver = process.env.SITE_MAIL_RECIEVER;
if (!mailReceiver) {
  throw new Error('SITE_MAIL_RECIEVER must be configured before updating the document');
}

// Define the document ID and the updated data
const documentId = 'KzS6kYoWzDJY07Cgj9VRkD'; // Replace with your document ID
const updatedDocument = {
  _id: documentId,
  _type: 'studentAdmission', // Replace with your document type
  // Add your fields here
  status: 'approved', // Example field
  email: mailReceiver
};

// Update the document
client
  .patch(documentId) // Document ID to patch
  .set(updatedDocument) // Shallow merge
  .commit()
  .then(() => {
    console.log('Document updated successfully');
  })
  .catch(() => {
    console.error('Error updating document');
    process.exitCode = 1;
  });
