import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const coverageReportUrl = '/coverage/lcov-report/index.html'; 

const CoverageWebView: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      )}
      <WebView
        source={{ uri: coverageReportUrl }}
        style={styles.webview}
        onLoad={() => setLoading(false)} 
        onError={(syntheticEvent) => {
           const { nativeEvent } = syntheticEvent;
           console.error('WebView error: ', nativeEvent.url, nativeEvent.description);
           setLoading(false);
        }}      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add padding or adjust as needed, but flex: 1 is crucial for the webview to fill space
  },
  webview: {
    flex: 1, // Make WebView fill the container
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1, // Ensure it's above the webview while loading
    // You might need to fine-tune the position
    transform: [{ translateX: -25 }, { translateY: -25 }], // Center it roughly
  },
});

export default CoverageWebView;