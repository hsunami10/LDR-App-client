import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, StyleSheet, View } from 'react-native';
import { MAX_TEXT_INPUT_LINES, MIN_TEXT_INPUT_VIEW_HEIGHT } from '../../constants/variables';

// BUG: In iOS, there's strange padding top that appears for no reason
// BUG: Flashes every time the text input height changes - why?
export class AutoExpandingTextInput extends Component {
  state = {
    initial_input_height: 0,
    diff_height: 0,
    content_height: 0,
    num_lines: 0
  }

  // NOTE: Called every time height of view is changed - IF height changes automatically
  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    console.log('======================== handleLayout ========================');
    if (this.state.initial_input_height === 0) {
      console.log('input view initial height: ' + height);
      this.setState(() => ({ initial_input_height: height }));
    }
  }

  // TODO
  // Handle single line changes - adding and removing
  // Handle multiple line changes - adding and removing
  // Max out lines
  handleContentSizeChange = e => {
    const { height } = e.nativeEvent.contentSize;
    console.log('==================== onContentSizeChange ====================');
    if (height > this.state.content_height) {
      this.setState(prevState => ({
        content_height: height,
        diff_height: height - this.state.content_height,
        num_lines: prevState.num_lines + 1
      }));
      // console.log('max line height: ' + (MAX_TEXT_INPUT_LINES * (height - this.state.content_height)));
      // console.log(this.state.num_lines);
      this.props.onContentSizeChange(height);
    } else if (height < this.state.content_height) {
      console.log('decrease number of lines');
    }
  }

  render() {
    console.log('number of lines: ' + this.state.num_lines);
    return (
      <View
        style={[styles.viewStyle,
          // this.state.initial_input_height === 0 ? {} : { height: this.state.initial_input_height } // NOTE: This stops onLayout from running every time height changes - value doesn't change?
          this.props.style || {}
        ]}
        onLayout={this.handleLayout}
      >
        <TextInput
          style={{
            // textAlignVertical: 'center', // Android only
          }}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          onContentSizeChange={this.handleContentSizeChange}
          multiline // NOTE: Enabling this makes text not vertically centered
          scrollEnabled={false}
          // numberOfLines={MAX_TEXT_INPUT_LINES} // Android only
        />
      </View>
    );
  }
}

AutoExpandingTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onContentSizeChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    // height: 29, // Margin top and bottom of 8
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    paddingTop: 0, // NOTE TODO: THis fixes center bug, but does it work in android? Change later if needed
    marginLeft: 8,
    marginRight: 8
  }
});
