import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getSearchTopics } from '../../../actions/SearchActions';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import { NO_SEARCH_TOPICS } from '../../../constants/noneMessages';
import { SortListTypes } from '../../../constants/variables';

class SearchTopicScreen extends Component {
  state = {
    height: 0,
    order: SortListTypes.topics.default.order,
    direction: SortListTypes.topics.default.direction,
    lastID: ''
  }

  paginateData = () => {
    const length = this.props.topics.length;
    const lastID = this.props.topics[length - 1].id;
    const lastData = this.props.topics[length - 1][this.state.order];
    if (this.state.lastID !== lastID) {
      this.props.getSearchTopics(
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
    this.setState(() => ({ lastID }));
  }

  handleRefresh = () => this.props.getSearchTopics(this.props.id, this.props.type, this.props.term, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation)

  handleSortTopics = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getSearchTopics(
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
    if (this.state.height === 0) {
      return null;
    } else if (this.props.initial_loading) {
      return <FullScreenLoading height={this.state.height} loading />;
    }
    return (
      <DataList
        type="topics"
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
        flatList
        data={this.props.topics}
        empty={this.props.topics.length === 0}
        message={`${NO_SEARCH_TOPICS} ${this.props.term}.`}
        enableSorting
        sortData={this.handleSortTopics}
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

SearchTopicScreen.propTypes = {
  id: PropTypes.string.isRequired,
  getSearchTopics: PropTypes.func.isRequired,
  topics: PropTypes.array.isRequired,
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
  topics: orderToArrData(state.search[ownProps.type].results.topics.order, state.topics.all_topics),
  initial_loading: state.search[ownProps.type].results.initial_loading,
  refreshing: state.search[ownProps.type].results.topics.refreshing,
  keepPaging: state.search[ownProps.type].results.topics.keepPaging,
  term: state.search[ownProps.type].term
});

export default connect(mapStateToProps, {
  getSearchTopics
})(SearchTopicScreen);
