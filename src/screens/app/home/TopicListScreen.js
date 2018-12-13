import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getSubscribedTopics } from '../../../actions/TopicActions';
import { FullScreenLoading } from '../../../components/common';
import TopicsList from '../../../components/topic/TopicsList';

class TopicListScreen extends Component {
  state = { height: 0 }

  componentDidMount() {
    this.props.getSubscribedTopics(this.props.id, false, 0, 'name', 'ASC', '');
  }

  handleTopicSelect = topic => {
    console.log('show topic screen');
    console.log(topic);
  }

  handleRefresh = () => this.props.getSubscribedTopics(this.props.id, true, 0, 'name', 'ASC', '')
  handlePageData = () => this.props.getSubscribedTopics(this.props.id, undefined, 10, 'name', 'ASC', '')

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.props.loading) {
      return (
        <View style={styles.loadingViewStyle}>
          <FullScreenLoading loading={this.props.loading} />
        </View>
      );
    }
    return (
      <TopicsList
        height={this.state.height}
        data={this.props.subscribed}
        empty={this.props.subscribed.length === 0}
        onTopicSelect={this.handleTopicSelect}
        refreshing={this.props.refreshing}
        handleRefresh={this.handleRefresh}

        // TODO: Finish these later
        // keepPaging={false}
        // paginateData={this.handlePageData}
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

TopicListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  getSubscribedTopics: PropTypes.func.isRequired,
  subscribed: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  loadingViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.topics.loading,
  refreshing: state.topics.refreshing,
  subscribed: state.topics.subscribed
});

export default connect(mapStateToProps, {
  getSubscribedTopics
})(TopicListScreen);
