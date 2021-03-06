import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getDiscoverTopics } from '../../../actions/DiscoverActions';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { NO_DISCOVER_TOPICS_MSG } from '../../../constants/noneMessages';
import { SortListTypes } from '../../../constants/variables';

class DiscoverTopicScreen extends Component {
  state = {
    height: 0,
    order: SortListTypes.topics.default.order,
    direction: SortListTypes.topics.default.direction,
    lastID: ''
  }

  componentDidMount() {
    this.props.getDiscoverTopics(
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
    const length = this.props.topics.length;
    const lastID = this.props.topics[length - 1].id;
    const lastData = this.props.topics[length - 1][this.state.order];
    if (this.state.lastID !== lastID) {
      this.props.getDiscoverTopics(
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

  handleRefresh = () => this.props.getDiscoverTopics(this.props.id, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation);

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

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
  topics: orderToArrData(state.discover.topics.order, state.topics.all_topics),
  initial_loading: state.discover.topics.initial_loading,
  refreshing: state.discover.topics.refreshing,
  keepPaging: state.discover.topics.keepPaging,
});

export default connect(mapStateToProps, { getDiscoverTopics })(DiscoverTopicScreen);
