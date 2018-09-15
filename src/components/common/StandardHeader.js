import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
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
 * http://usejsdoc.org/tags-type.html
 *
 * @callback onPressLeft      (optional) The action to take when the left action is pressed.
 * @callback onPressRight     (optional) The action to take when the right action is pressed.
 *
 * @param {Object}   props
 * @param {string}   props.title                          The header title.
 * @param {string}   [props.leftTitle=null]               The title of the left action.
 * @param {string}   [props.rightTitle='Submit']          The title of the right action.
 * @param {boolean}  [props.showLeft]                     Whether or not to show the default left.
 * @param {boolean}  [props.showRight]                    Whether or not to show the default right.
 * @param {boolean}  [props.disableBack]                  Disable Android hardware back button.
 * @param {number}   [props.height=MIN_HEADER_HEIGHT]     The height of the header.
 * @param {React}    [props.headerLeft]                   Custom component for the header left.
 *                                                        Rendered when props.showLeft = undefined.
 * @param {React}    [props.headerRight]                  Custom component for the header right.
 *                                                        Rendered when props.showRight = undefined.
 */
export class StandardHeader extends Component {
  componentDidMount() {
    if (this.props.disableBack) {
      if (Platform.OS === 'android') {
        console.log('add android handler');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.disableBack) {
      if (Platform.OS === 'android') {
        console.log('remove android handler');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      }
    }
  }

  handleBackButton = () => {
    console.log('android hardware back button pressed');
    return true;
  }

  render() {
    const height = this.props.height || MIN_HEADER_HEIGHT;
    const {
      onPressLeft,
      onPressRight,
      title,
      leftTitle,
      rightTitle,
      showLeft,
      showRight,
      headerLeft,
      headerRight
    } = this.props;
    return (
      <View style={[styles.containerStyle, { height }]}>
        <View styles={[styles.containerStyle, styles.actionsContainerStyle]}>
          {showLeft ? (
            <HeaderLeft
              onPressLeft={onPressLeft}
              leftTitle={leftTitle}
            />
          ) : headerLeft}
          {showRight ? (
            <HeaderRight
              onPressRight={onPressRight}
              rightTitle={rightTitle}
            />
          ) : headerRight}
        </View>

        <View
          pointerEvents="none"
          style={[styles.containerStyle, { height }, styles.titleContainerStyle]}
        >
          <HeaderTitle style={styles.headerTitleStyle}>{title}</HeaderTitle>
        </View>
      </View>
    );
  }
}

StandardHeader.propTypes = {
  disableBack: PropTypes.bool,
  height: PropTypes.number,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  title: PropTypes.string.isRequired,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  headerLeft: PropTypes.element,
  headerRight: PropTypes.element
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