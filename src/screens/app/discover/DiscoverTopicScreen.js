import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getDiscoverTopics } from '../../../actions/DiscoverActions';
import { orderToArrData } from '../../../assets/helpers/misc';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { NO_DISCOVER_TOPICS_MSG } from '../../../constants/noneMessages';

class DiscoverTopicScreen extends Component {
  state = {
    height: 0,
    order: 'num_subscribers',
    direction: 'DESC'
  }

  componentDidMount() {
    this.props.getDiscoverTopics(
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
    if (this.state.order === 'date_created') {
      benchmark = this.props.topics[0].date_created;
    } else if (this.state.order === 'num_subscribers') {
      benchmark = this.props.topics[0].num_subscribers;
    }
    this.props.getDiscoverTopics(
      this.props.id,
      null,
      this.props.offset,
      this.state.order,
      this.state.direction,
      benchmark,
      this.props.parentNavigation
    );
  }

  handleRefresh = () => this.props.getDiscoverTopics(this.props.id, true, 0, this.state.order, this.state.direction, moment().unix(), this.props.parentNavigation);

  // NOTE: Exact same as HomeTopicScreen
  handleTopicSelect = topic => {
    console.log('show topic screen');
    console.log(topic);
  }

  handleSortUsers = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getDiscoverTopics(
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
    return (
      <DataList
        type="topics"
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
        onItemSelect={this.handleTopicSelect}
        flatList
        data={this.props.topics}
        empty={this.props.topics.length === 0}
        message={NO_DISCOVER_TOPICS_MSG}
        enableSorting
        sortData={this.handleSortUsers}
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

DiscoverTopicScreen.propTypes = {
  id: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  getDiscoverTopics: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => {
  const topics = orderToArrData(state.discover.topics.order, state.topics.all_topics);
  return {
    id: state.auth.id,
    topics,
    initial_loading: state.discover.topics.initial_loading,
    refreshing: state.discover.topics.refreshing,
    keepPaging: state.discover.topics.keepPaging,
    offset: state.discover.topics.offset,
  };
};

export default connect(mapStateToProps, { getDiscoverTopics })(DiscoverTopicScreen);
