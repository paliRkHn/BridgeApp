// // Add this component to test your Firebase Storage setup
// import React, { useEffect, useState } from 'react';
// import { View, Text, Image } from 'react-native';
// import { ref, getDownloadURL } from 'firebase/storage';
// import { storage } from './firebase';

// const DebugFirebaseImage = () => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [error, setError] = useState(null);
//   const [bucketInfo, setBucketInfo] = useState(null);

//   useEffect(() => {
//     // Debug: Check bucket configuration
//     console.log('🔧 Storage bucket:', storage.app.options.storageBucket);
//     setBucketInfo(storage.app.options.storageBucket);

//     const testFirebaseStorage = async () => {
//       try {
//         console.log('🔍 Attempting to get download URL...');
        
//         const imageRef = ref(storage, 'company-banners/israel-andrade-YI_9SivVt_s-unsplash.jpg');
//         const url = await getDownloadURL(imageRef);
        
//         console.log('✅ Success! Got URL:', url);
//         setImageUrl(url);
        
//       } catch (err) {
//         console.error('❌ Firebase Storage Error:', err);
//         console.error('Error code:', err.code);
//         console.error('Error message:', err.message);
//         setError(err.message);
//       }
//     };

//     testFirebaseStorage();
//   }, []);

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Firebase Storage Debug:</Text>
//       <Text>Bucket: {bucketInfo}</Text>
      
//       {error && (
//         <Text style={{ color: 'red' }}>Error: {error}</Text>
//       )}
      
//       {imageUrl && (
//         <View>
//           <Text style={{ color: 'green' }}>✅ URL obtained successfully!</Text>
//           <Text style={{ fontSize: 10 }}>{imageUrl}</Text>
          
//           <Image
//             source={{ uri: imageUrl }}
//             style={{ width: 200, height: 100, marginTop: 10 }}
//             onLoad={() => console.log('🖼️ Image displayed successfully!')}
//             onError={(e) => console.error('🖼️ Image display error:', e.nativeEvent.error)}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default DebugFirebaseImage;