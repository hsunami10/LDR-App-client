import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { MAX_POST_BODY_LINES, VIEW_MORE_TEXT } from '../../constants/variables';

// TODO: Check if number of lines exceeds MAX_POST_BODY_LINES to decide whether or not to show "more"
// QUESTION: How to get line height?
// QUESTION: Or how to get number of lines?
// NOTE BUG: Temporary fix, because hardcoded and height jump is visible - delay in setting local state
class PostCardBody extends Component {
  state = { height: 0 }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  handleMorePress = () => this.props.viewPost(this.props.post)

  renderBody = () => {
    if (!this.props.viewing) { // Only true when NOT on ViewPostScreen
      return (
        <View style={{ flex: 1 }}>
          <Text
            onLayout={this.handleLayout}
            numberOfLines={MAX_POST_BODY_LINES}
            ellipsizeMode="tail"
            suppressHighlighting
          >
            {this.props.post.body}
          </Text>
          {
            this.state.height > 80 ?
            <Text onPress={this.handleMorePress} style={styles.moreTextStyle}>{VIEW_MORE_TEXT}</Text> :
            null
          }
        </View>
      );
    }
    return <Text suppressHighlighting>{this.props.post.body}</Text>;
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        {this.renderBody()}
      </View>
    );
  }
}

PostCardBody.propTypes = {
  post: PropTypes.object.isRequired,
  viewing: PropTypes.bool,
  viewPost: PropTypes.func
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  moreTextStyle: {
    fontWeight: '300',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5
  }
});

export default PostCardBody;
