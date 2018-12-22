import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getDiscoverPosts } from '../../../actions/DiscoverActions';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import { NO_DISCOVER_POSTS_MSG } from '../../../constants/noneMessages';
import { SortListTypes } from '../../../constants/variables';

class DiscoverPostScreen extends Component {
  state = {
    height: 0,
    order: SortListTypes.posts.default.order,
    direction: SortListTypes.posts.default.direction,
    lastID: ''
  }

  componentDidMount() {
    this.props.getDiscoverPosts(
      this.props.id,
      false,
      this.state.order,
      this.state.direction,
      '',
      '',
      this.props.parentNavigation
    );
  }

  paginateData = () => {
    const length = this.props.posts.length;
    const lastID = this.props.posts[length - 1].id;
    const lastData = this.props.posts[length - 1][this.state.order];
    if (this.state.lastID !== lastID) {
      this.props.getDiscoverPosts(
        this.props.id,
        null,
        this.state.order,
        this.state.direction,
        lastID,
        lastData,
        this.props.parentNavigation
      );
    }
    this.setState(() => ({ lastID }));
  }

  handleRefresh = () => this.props.getDiscoverPosts(this.props.id, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation)

  handleSortPosts = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getDiscoverPosts(
      this.props.id,
      true,
      order,
      direction,
      '',
      '',
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
        message={NO_DISCOVER_POSTS_MSG}
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

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
  posts: orderToArrData(state.discover.posts.order, state.posts.all_posts),
  initial_loading: state.discover.posts.initial_loading,
  refreshing: state.discover.posts.refreshing,
  keepPaging: state.discover.posts.keepPaging,
});

export default connect(mapStateToProps, {
  getDiscoverPosts
})(DiscoverPostScreen);
