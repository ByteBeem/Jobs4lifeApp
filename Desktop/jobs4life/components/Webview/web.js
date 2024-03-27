import React from 'react';
import { WebView } from 'react-native-webview';

const WebViewer = ({ link }) => {
  return (
    <WebView
      source={{ uri: link }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default WebViewer;
