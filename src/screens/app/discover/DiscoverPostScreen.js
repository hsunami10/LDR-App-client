import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getDiscoverPosts } from '../../../actions/DiscoverActions';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { orderToArrData } from '../../../assets/helpers/misc';
import { EMPTY_DISCOVER_POST_MSG } from '../../../constants/noneMessages';

class DiscoverPostScreen extends Component {
  state = {
    height: 0,
    order: 'date_posted',
    direction: 'DESC'
  }

  componentDidMount() {
    this.props.getDiscoverPosts(
      this.props.id,
      false,
      0,
      this.state.order,
      this.state.direction,
      moment().unix(),
      this.props.parentNavigation
    );
  }

  paginateData = () => {
    let benchmark;
    if (this.state.order === 'date_posted') {
      benchmark = this.props.posts[0].date_posted;
    } else if (this.state.order === 'num_likes') {
      benchmark = this.props.posts[0].num_likes;
    }
    this.props.getDiscoverPosts(
      this.props.id,
      null,
      this.props.offset,
      this.state.order,
      this.state.direction,
      benchmark,
      this.props.parentNavigation
    );
  }

  handleRefresh = () => this.props.getDiscoverPosts(this.props.id, true, 0, this.state.order, this.state.direction, moment().unix(), this.props.parentNavigation)

  handleSortPosts = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getDiscoverPosts(
      this.props.id,
      true,
      0,
      order,
      direction,
      moment().unix(),
      this.props.parentNavigation
    );
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.state.height === 0) { // Get rid of small jump in spinning icon
      return null;
    } else if (this.props.initial_loading) { // Only true once, on componentDidMount
      return <FullScreenLoading height={this.state.height} loading />;
    }
    // Only updates root components (PostCard), so remember to force re-render nested components by changing state
    return (
      <DataList
        type="posts"
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
        flatList
        data={this.props.posts}
        empty={this.props.posts.length === 0}
        message={EMPTY_DISCOVER_POST_MSG}
        enableSorting
        sortData={this.handleSortPosts}
        enablePaging
        paginateData={this.paginateData}
        keepPaging={this.props.keepPaging}
        height={this.state.height}
        enableRefresh
        refreshing={this.props.refreshing}
        handleRefresh={this.handleRefresh}
      />
    );
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={this.handleLayout}
      >
        {this.renderBody()}
      </View>
    );
  }
}

DiscoverPostScreen.propTypes = {
  id: PropTypes.string.isRequired,
  getDiscoverPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => {
  const posts = orderToArrData(state.discover.posts.order, state.posts.all_posts);
  return {
    id: state.auth.id,
    posts,
    initial_loading: state.discover.posts.initial_loading,
    refreshing: state.discover.posts.refreshing,
    keepPaging: state.discover.posts.keepPaging,
    offset: state.discover.posts.offset,
  };
};

export default connect(mapStateToProps, {
  getDiscoverPosts
})(DiscoverPostScreen);
