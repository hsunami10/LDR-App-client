import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, FlatList } from 'react-native';
import { pushTabRoute } from '../../actions/NavigationActions';
import CommentCard from './CommentCard';
import { NO_COMMENTS_FOR_POST_MSG } from '../../constants/noneMessages';

class CommentList extends Component {
  viewProfile = (id, username) => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', { id, username });
  }

  renderPosts = ({ item }) => (
    <CommentCard
      comment={item}
      viewProfile={this.viewProfile}
      parentNavigation={this.props.parentNavigation}
    />
  )

  renderMessage = ({ item }) => (
    <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{item.text}</Text>
  )

  render() {
    return (
      <FlatList
        data={this.props.empty ? [{ id: 'foo', text: NO_COMMENTS_FOR_POST_MSG }] : this.props.data}
        renderItem={this.props.empty ? this.renderMessage : this.renderPosts}
        keyExtractor={comment => comment.id}
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        onEndReachedThreshold={0}
        scrollEnabled={false}
      />
    );
  }
}

CommentList.propTypes = {
  id: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,
  pushTabRoute: PropTypes.func.isRequired,

  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of 1 object with { id, text } if no posts to show
  empty: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  scrollEventThrottle: PropTypes.number
};

const mapStateToProps = state => ({
  id: state.auth.id,
  current_tab: state.navigation.current_tab,
});

export default connect(mapStateToProps, {
  pushTabRoute
})(CommentList);
