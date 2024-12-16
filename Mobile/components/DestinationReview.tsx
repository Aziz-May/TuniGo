import { useState } from 'react';
import { auth, firestore } from '../firebase'; // Ensure correct imports
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { TextInput, Button, View, Text } from 'react-native'; // Correct imports

interface DestinationReviewProps {
  destinationId: string;
}

const DestinationReview: React.FC<DestinationReviewProps> = ({ destinationId }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  // Handle review submission
  const handleReviewSubmit = async () => {
    // Ensure the user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to submit a review');
      return;
    }

    const destinationRef = doc(firestore, 'destinations', destinationId);

    const destinationDoc = await getDoc(destinationRef);

    if (destinationDoc.exists()) {
      const destinationData = destinationDoc.data();

      if (!destinationData.reviews || destinationData.reviews.length === 0) {
        await setDoc(destinationRef, {
          reviews: [
            {
              user: user.displayName,
              comment: review,
              stars: rating,
              date: new Date().toISOString(),
            },
          ],
        }, { merge: true });
        alert('First review submitted successfully!');
      } else {
        await updateDoc(destinationRef, {
          reviews: arrayUnion({
            user: user.displayName,
            comment: review,
            stars: rating,
            date: new Date().toISOString(),
          }),
        });
        alert('Review submitted successfully!');
      }
    } else {
      alert('Destination not found!');
    }

    setReview('');
    setRating(0);
  };

  return (
    <View>
      <TextInput
        value={review}
        onChangeText={setReview} // Correct method for updating state
        placeholder="Write your review here..."
        multiline
        style={{
          height: 100,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Text>Rating:</Text>
      <TextInput
        value={String(rating)} // Make sure to cast rating to string
        onChangeText={(text) => setRating(Number(text))} // Correct number input handling
        keyboardType="numeric"
        maxLength={1}
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <Button onPress={handleReviewSubmit} title="Submit Review" />
    </View>
  );
};

export default DestinationReview;
