import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { StandardHeader } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';

// TODO: componentDidMount / reload, store in app state screens - like ViewProfileScreen
class ViewPostScreen extends Component {
  state = {
    screen_id: shortid(),
    post_id: ''
  }

  componentDidMount() {
    const post = this.props.navigation.getParam('post', {});
    const showKeyboard = this.props.navigation.getParam('showKeyboard', false);

    console.log('grab post comments for post', post);
    console.log('should look exactly the same as PostCard, but body is not line restricted');
    console.log('show keyboard: ' + showKeyboard);
    console.log(this.props.screenProps);
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id
    });
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
        <PostCard
          userID={this.props.id}
          post={item}
          viewProfile={this.viewProfile}
          viewPost={() => null}
          postLikes={this.props.post_likes}
          navigation={this.props.navigation}
          parentNavigation={this.props.screenProps.parentNavigation}
        />
        <Text>No comments available</Text>
      </View>
    );
  }
}

ViewPostScreen.propTypes = {
  id: PropTypes.string.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
  }
});

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(ViewPostScreen);
