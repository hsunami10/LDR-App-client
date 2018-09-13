import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { HeaderTitle, HeaderBackButton } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MIN_HEADER_HEIGHT } from '../../constants/variables';

export const StandardHeader = props => {
  return (
    <View style={styles.containerStyle}>
      <View styles={[styles.containerStyle, styles.actionsContainerStyle]}>
        <View style={styles.leftContainerStyle}>
          <HeaderBackButton
            title={props.backButtonTitle || null}
            onPress={() => props.navigation.goBack()}
          />
        </View>
        <View style={styles.rightContainerStyle}>
          <TouchableOpacity onPress={() => console.log('submit')}>
            <Text style={styles.rightTextStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View pointerEvents="none" style={[styles.containerStyle, styles.titleContainerStyle]}>
        <HeaderTitle style={styles.headerTitleStyle}>{props.title}</HeaderTitle>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: MIN_HEADER_HEIGHT,
    top: 0,
    right: 0,
    left: 0,
    paddingTop: getStatusBarHeight(true),
    backgroundColor: '#f8f8f8'
    // position: 'absolute'
  },
  actionsContainerStyle: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  leftContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-start',
    height: MIN_HEADER_HEIGHT - getStatusBarHeight(true), // Default header height, no status bar
    width: MIN_HEADER_HEIGHT - getStatusBarHeight(true)
  },
  rightContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: MIN_HEADER_HEIGHT - getStatusBarHeight(true)
  },
  titleContainerStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleStyle: {
    color: 'black',
    fontSize: 18
  },
  rightTextStyle: {
    color: '#007aff',
    fontSize: 16
  }
});
