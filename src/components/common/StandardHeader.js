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
// TODO: Handle iOS vs. Android design

/**
 * This is a customizable header.
 * http://usejsdoc.org/tags-type.html
 *
 * @callback onLeftPress      (optional) The action to take when the left action is pressed.
 * @callback onRightPress     (optional) The action to take when the right action is pressed.
 *
 * @param {Object}   props
 * @param {string}   props.title                          The header title.
 * @param {string}   [props.leftTitle=null]               The title of the left action.
 * @param {string}   [props.rightTitle='Submit']          The title of the right action.
 * @param {boolean}  [props.showLeft]                     Whether or not to show the header left.
 * @param {boolean}  [props.showRight]                    Whether or not to show the header right.
 * @param {boolean}  [props.disableBack]                  Disable Android hardware back button.
 * @param {number}   [props.height=MIN_HEADER_HEIGHT]     The height of the header.
 * @param {React}    [props.headerLeft]                   Custom component for the header left.
 * @param {React}    [props.headerRight]                  Custom component for the header right.
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

  handleBackButton = () => true;

  render() {
    const height = this.props.height || MIN_HEADER_HEIGHT;
    const {
      onLeftPress,
      onRightPress,
      title,
      leftTitle,
      rightTitle,
      showLeft,
      showRight,
      headerLeft,
      headerRight,
      disableRight,
      disableLeft
    } = this.props;

    let titleAlign = {};
    if (Platform.OS === 'ios' || typeof title !== 'string') titleAlign = { alignItems: 'center' };
    else titleAlign = { marginLeft: this.props.disableBack ? 0 : MIN_HEADER_HEIGHT };

    return (
      <View style={[styles.containerStyle, { height }]}>
        <View styles={[styles.containerStyle, styles.actionsContainerStyle]}>
          {showLeft ? (
            <HeaderLeft
              headerLeft={headerLeft}
              onLeftPress={onLeftPress}
              leftTitle={leftTitle}
              disableLeft={disableLeft}
            />
          ) : null}
          {showRight ? (
            <HeaderRight
              headerRight={headerRight}
              onRightPress={onRightPress}
              rightTitle={rightTitle}
              disableRight={disableRight}
            />
          ) : null}
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.containerStyle,
            { height },
            styles.titleContainerStyle,
            titleAlign]}
        >
          {typeof title === 'string' ?
          <HeaderTitle style={styles.headerTitleStyle}>{title}</HeaderTitle> :
          title}
        </View>
      </View>
    );
  }
}

StandardHeader.propTypes = {
  disableBack: PropTypes.bool,
  height: PropTypes.number,
  onLeftPress: PropTypes.func,
  onRightPress: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  headerLeft: PropTypes.element,
  headerRight: PropTypes.element,
  disableRight: PropTypes.bool,
  disableLeft: PropTypes.bool
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
    justifyContent: 'center'
  },
  headerTitleStyle: {
    color: 'black',
    fontSize: 18
  }
});
