import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, FlatList } from 'react-native';
import { pushTabRoute } from '../../actions/NavigationActions';
import CommentCard from './CommentCard';

class CommentsList extends Component {
  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id
    });
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
        data={this.props.empty ? [{ id: 'foo', text: this.props.none_msg }] : this.props.data}
        renderItem={this.props.empty ? this.renderMessage : this.renderPosts}
        keyExtractor={comment => comment.id}
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        onEndReachedThreshold={0}
        scrollEnabled={false}
      />
    );
  }
}

CommentsList.propTypes = {
  id: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,
  none_msg: PropTypes.string.isRequired,
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
  none_msg: state.comments.none_msg
});

export default connect(mapStateToProps, {
  pushTabRoute
})(CommentsList);
