import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight, Text, ActivityIndicator, StyleSheet } from 'react-native';

const PageCommentsButton = ({ keepPaging, loading, loadingSize, handlePress }) => (
  keepPaging ?
  <TouchableHighlight
    style={styles.pageButtonStyle}
    onPress={handlePress}
    underlayColor="rgba(0,0,0,0.3)"
  >
    <View style={styles.subViewStyle}>
      {loading ? <ActivityIndicator size={loadingSize || 'small'} /> : null}
      <Text>
        View Previous Comments
      </Text>
    </View>
  </TouchableHighlight> :
  null
);

PageCommentsButton.propTypes = {
  keepPaging: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  handlePress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  pageButtonStyle: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PageCommentsButton;
