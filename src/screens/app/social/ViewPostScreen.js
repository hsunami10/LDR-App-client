import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { View, Text, StyleSheet } from 'react-native';
import { StandardHeader } from '../../../components/common';

// TODO: componentDidMount / reload, store in app state screens - like ViewProfileScreen
// QUESTION: How to navigate to another copy of MainScreen, with exactly the same state as the original one
// except starting tab and screen is different
class ViewPostScreen extends Component {
  state = {
    screen_id: shortid(),
    post_id: ''
  }

  componentDidMount() {
    console.log('grab post comments for post', this.props.navigation.getParam('post', {}));
    console.log('should look exactly the same as PostCard, but body is not line restricted');
  }

  handleLeftPress = () => {
    // TODO: Update app state if needed
    this.props.navigation.pop();
  }

  render() {
    return (
      <View style={styles.centerItems}>
        <StandardHeader
          title="Post"
          showLeft
          onLeftPress={this.handleLeftPress}
        />
        {/* <PostCard
          userID={this.props.id}
          post={item}
          viewProfile={this.viewProfile}
          postLikes={this.props.post_likes}
          navigation={this.props.navigation}
          parentNavigation={this.props.parentNavigation}
        /> */}
        <Text>No comments available</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
  }
});

export default ViewPostScreen;
