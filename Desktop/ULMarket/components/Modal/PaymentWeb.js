import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const Payment = ({ route }) => {
  const { uri } = route.params;
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          size="large"
          color="#0000ff"
        />
      )}
      <WebView
        source={{ uri }}
        onLoad={handleLoad}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Payment;
