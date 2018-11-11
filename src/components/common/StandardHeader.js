import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, BackHandler, Platform, Dimensions } from 'react-native';
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
      disableLeft,
      tabTitleWidth
    } = this.props;

    let titleAlign = {};
    if (Platform.OS === 'ios' || typeof title !== 'string') titleAlign = { alignItems: 'center' };
    else if (typeof title === 'string') titleAlign = { marginLeft: this.props.disableBack ? 0 : MIN_HEADER_HEIGHT };

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
          pointerEvents={tabTitleWidth ? undefined : 'none'} // If there's a tab bar title, then allow clicks on view
          style={[
            styles.containerStyle,
            { height },
            styles.titleContainerStyle,
            titleAlign,
            (tabTitleWidth ? // If there's a tab bar title, then adjust the width so it won't block the left and right actions
              {
                left: (Dimensions.get('window').width - tabTitleWidth) / 2,
                right: (Dimensions.get('window').width - tabTitleWidth) / 2
              } :
              {}
            )]}
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
  ]),
  leftTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  rightTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  headerLeft: PropTypes.element,
  headerRight: PropTypes.element,
  disableRight: PropTypes.bool,
  disableLeft: PropTypes.bool,
  tabTitleWidth: PropTypes.number // The width of the tab bar
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
    backgroundColor: 'transparent'
  },
  titleContainerStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  headerTitleStyle: {
    color: 'black',
    fontSize: 18
  }
});
