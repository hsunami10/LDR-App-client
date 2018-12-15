import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/DataList';
import { getUserFeed } from '../../../actions/FeedActions';
import { pushTabRoute } from '../../../actions/NavigationActions';
import { EMPTY_FEED_MSG } from '../../../constants/noneMessages';
import { logOut } from '../../../assets/helpers/authentication';
import { orderToArrData } from '../../../assets/helpers/misc';

// TODO: Add 3 tabs later - Feed, Topics, Friends

/*
HOW TO POPULATE THIS SCREEN
Show posts with a search header on top to search / filter for keywords

Animation Help - https://www.youtube.com/watch?v=vzPmI0GCDPM

NOTE: Get data from database (for regular feed), but when user searches, search with data retrieved from database
- or maybe search WITH database? might be heavy + slower
- but might be better because what if the user types something before data is retrieved from database? - slow internet
- then they cannot search anything until the data is retrieved
- could disable search...but that will be kind of bad

NOTE: Combine multiple select queries and order by example
(select id, date_joined from aliases) UNION ALL (select id, date_joined from users) ORDER BY date_joined asc;
https://stackoverflow.com/questions/11828772/postgresql-combine-multiple-select-statements

TODO: Figure out how to get and organize data from database
Things to keep in mind:
  Exclude:
    - partner's aliases
    - blocked users
  Include:
    - topics subscribed to
    - friends' posts
    - your posts
Order from: (top to bottom) most recent to oldest

First get data for exclusions
Run loops to create the correct query string
Apply those query strings to the inclusions
 */

class FeedScreen extends Component {
  state = {
    height: 0,
    order: 'date_posted',
    direction: 'DESC'
  }

  componentDidMount() {
    if (this.props.current_route === 'home') {
      this.props.getUserFeed(
        this.props.id,
        0,
        false,
        this.state.order,
        this.state.direction,
        moment().unix(),
        this.handleNoUserError
      );
    }
  }

  paginateData = () => {
    let benchmark;
    if (this.state.order === 'date_posted') {
      benchmark = this.props.posts[0].date_posted;
    } else if (this.state.order === 'num_likes') {
      benchmark = this.props.posts[0].num_likes;
    }
    this.props.getUserFeed(
      this.props.id,
      this.props.offset,
      null,
      this.state.order,
      this.state.direction,
      benchmark,
      this.handleNoUserError
    );
  }

  handleNoUserError = () => this.props.logOut(this.props.parentNavigation)

  handleRefresh = () => {
    this.props.getUserFeed(
      this.props.id,
      0,
      true,
      this.state.order,
      this.state.direction,
      moment().unix(),
      this.handleNoUserError
    );
  }

  handleSortPosts = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getUserFeed(this.props.id, 0, true, order, direction, moment().unix(), this.handleNoUserError);
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
        message={EMPTY_FEED_MSG}
        enableSorting
        sortData={this.handleSortPosts}
        enablePaging
        paginateData={this.paginateData}
        keepPaging={this.props.keepPaging}
        height={this.state.height}
        enableRefresh
        refreshing={this.props.loading}
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

FeedScreen.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUserFeed: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  current_route: PropTypes.string.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchViewStyle: {
    backgroundColor: 'blue',
    position: 'absolute',
    width: Dimensions.get('window').width
  }
});

const mapStateToProps = state => {
  // Pre-process posts - convert from an object of objects to an array of objects
  const posts = orderToArrData(state.feed.posts_order, state.posts.all_posts);
  return {
    id: state.auth.id,
    loading: state.feed.loading,
    initial_loading: state.feed.initial_loading,
    current_route: state.navigation.current_route,
    offset: state.feed.offset,
    posts,
    keepPaging: state.feed.keepPaging
  };
};

export default connect(mapStateToProps, {
  getUserFeed,
  pushTabRoute,
  logOut
})(FeedScreen);
