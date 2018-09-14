import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeaderTitle } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MIN_HEADER_HEIGHT } from '../../constants/variables';
import { HeaderLeft } from './HeaderLeft';
import { HeaderRight } from './HeaderRight';

// TODO: Handle background images
// TODO: Handle custom left and right actions.
// TODO: Handle animations - with an animated prop, use Animated.View instead

/**
 * This is a customizable header.
 *
 * @callback onPressLeft      (optional) The action to take when the left action is pressed.
 * @callback onPressRight     (optional) The action to take when the right action is pressed.
 *
 * All parameters are a part of the props object.
 *
 * @param {Object}   props
 * @param {string}   props.title                          The header title.
 * @param {string}   [props.leftTitle=null]               The title of the left action.
 * @param {string}   [props.rightTitle='Submit']          The title of the right action.
 * @param {boolean}  [props.showLeft]                     Determine whether to show a left action.
 * @param {boolean}  [props.showRight]                    Determine whether to show a right action.
 * @param {number}   [props.height=MIN_HEADER_HEIGHT]     The height of the header.
 */
export const StandardHeader = props => {
  const height = props.height || MIN_HEADER_HEIGHT;
  const { onPressLeft, onPressRight, title, leftTitle, rightTitle, showLeft, showRight } = props;
  return (
    <View style={[styles.containerStyle, { height }]}>
      <View styles={[styles.containerStyle, styles.actionsContainerStyle]}>
        {showLeft ? (
          <HeaderLeft
            onPressLeft={onPressLeft}
            leftTitle={leftTitle}
          />
        ) : null}
        {showRight ? (
          <HeaderRight
            onPressRight={onPressRight}
            rightTitle={rightTitle}
          />
        ) : null}
      </View>

      <View
        pointerEvents="none"
        style={[styles.containerStyle, { height }, styles.titleContainerStyle]}
      >
        <HeaderTitle style={styles.headerTitleStyle}>{title}</HeaderTitle>
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
  titleContainerStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleStyle: {
    color: 'black',
    fontSize: 18
  }
});
