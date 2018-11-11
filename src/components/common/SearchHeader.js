import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SEARCH_HEADER_HEIGHT } from '../../constants/variables';

// TODO: Figure out how to incorporate with other elements in header (left and right)
export class SearchHeader extends Component {
  state = {
    screenWidth: Dimensions.get('window').width,
    fullCancelWidth: 0,
    cancelWidth: new Animated.Value(0),
    inAnimation: true
  }

  handleLayout = e => {
    const { width } = e.nativeEvent.layout;
    // Run once
    if (width !== 0 && this.state.fullCancelWidth === 0) {
      this.setState(() => ({ fullCancelWidth: width, inAnimation: false }));
    }
  }

  startAnimations = () => {
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus();
    }
    this.setState(() => ({ inAnimation: true }));
    Animated.timing(this.state.cancelWidth, {
      toValue: this.state.fullCancelWidth,
      duration: this.props.animationDuration || 200
    }).start();
  }

  cancel = () => {
    this.props.onCancelPress();
    Animated.timing(this.state.cancelWidth, {
      toValue: 0,
      duration: this.props.animationDuration || 200
    }).start(() => this.setState(() => ({ inAnimation: false })));
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle || {}]}>
        <Animated.View style={styles.inputContainerStyle}>
          <TextInput
            placeholder={this.props.placeholder}
            autoCorrect={false}
            autoCapitalize="none"
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            onSubmitEditing={this.props.onSubmitEditing}
            onFocus={this.startAnimations}
            returnKeyType={this.props.returnKeyType || 'search'}
          />
        </Animated.View>
        <Animated.View
          onLayout={this.handleLayout}
          style={[styles.cancelContainerStyle, {
            display: this.state.inAnimation ? 'flex' : 'none',
            width: this.state.cancelWidth,
            opacity: this.state.cancelWidth.interpolate({
              inputRange: [0, this.state.fullCancelWidth],
              outputRange: [0, 1]
            })
          }, (this.state.fullCancelWidth === 0 ? { width: 'auto' } : {})]}
        >
          <TouchableOpacity
            onPress={this.cancel}
          >
            <Text style={{ fontSize: 14 }} numberOfLines={1} ellipsizeMode="clip">Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

SearchHeader.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onCancelPress: PropTypes.func.isRequired,
  animationDuration: PropTypes.number,
  returnKeyType: PropTypes.string,
  containerStyle: PropTypes.object
};

const styles = StyleSheet.create({
  containerStyle: {
    height: SEARCH_HEADER_HEIGHT,
    top: 0,
    right: 0,
    left: 0,
    paddingTop: getStatusBarHeight(true),
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  inputContainerStyle: {
    flex: 1,
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    height: SEARCH_HEADER_HEIGHT - getStatusBarHeight(true) - 16, // 8 * 2 - margin top and bottom = 8
    marginLeft: 8,
    marginRight: 8
  },
  cancelContainerStyle: {
    marginRight: 8
  }
});
