import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getSearchPosts } from '../../../actions/SearchActions';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import { NO_SEARCH_POSTS } from '../../../constants/noneMessages';

class SearchPostScreen extends Component {
  state = {
    height: 0,
    order: 'date_posted',
    direction: 'DESC'
  }

  paginateData = () => {
    const length = this.props.posts.length;
    const lastID = this.props.posts[length - 1].id;
    let lastData;
    if (this.state.order === 'date_posted') {
      lastData = this.props.posts[length - 1].date_posted;
    } else if (this.state.order === 'num_likes') {
      lastData = this.props.posts[length - 1].num_likes;
    }
    this.props.getSearchPosts(
      this.props.id,
      this.props.type,
      this.props.term,
      null,
      this.state.order,
      this.state.direction,
      lastID,
      lastData,
      this.props.parentNavigation
    );
  }

  handleRefresh = () => this.props.getSearchPosts(this.props.id, this.props.type, this.props.term, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation)

  handleSortPosts = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getSearchPosts(
      this.props.id,
      this.props.type,
      this.props.term,
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
        message={`${NO_SEARCH_POSTS} ${this.props.term}.`}
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

SearchPostScreen.propTypes = {
  id: PropTypes.string.isRequired,
  getSearchPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  term: PropTypes.string.isRequired,

  type: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = (state, ownProps) => ({
  id: state.auth.id,
  posts: orderToArrData(state.search[ownProps.type].results.posts.order, state.posts.all_posts),
  initial_loading: state.search[ownProps.type].results.initial_loading,
  refreshing: state.search[ownProps.type].results.posts.refreshing,
  keepPaging: state.search[ownProps.type].results.posts.keepPaging,
  term: state.search[ownProps.type].term
});

export default connect(mapStateToProps, {
  getSearchPosts
})(SearchPostScreen);
