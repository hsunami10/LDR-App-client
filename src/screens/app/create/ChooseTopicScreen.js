import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/common/DataList';
import { getSubscribedTopics, choosePostTopic, startTopicLoading, stopTopicLoading } from '../../../actions/TopicActions';
import { NO_SUBSCRIBED_TOPICS_MSG } from '../../../constants/noneMessages';

class ChooseTopicScreen extends Component {
  componentDidMount() {
    this.props.getSubscribedTopics(this.props.id, false, 'lowercase_name', 'ASC');
  }

  // No handle for navigation in componentWillUnmount because there was no change navigating here
  componentWillUnmount() {
    if (this.props.loading) {
      this.props.stopTopicLoading();
    }
  }

  handleRefresh = () => this.props.getSubscribedTopics(this.props.id, true, 'lowercase_name', 'ASC')

  handleTopicSelect = topic => {
    this.props.choosePostTopic(topic);
    this.props.navigation.pop();
  }

  renderBody() {
    if (this.props.loading) {
      return <FullScreenLoading loading allowTouchThrough />;
    }
    return (
      <DataList
        type="topics"
        flatList
        data={this.props.subscribed}
        empty={this.props.subscribed.length === 0}
        message={NO_SUBSCRIBED_TOPICS_MSG}
        onItemSelect={this.handleTopicSelect}
        enableRefresh
        refreshing={this.props.refreshing}
        handleRefresh={this.handleRefresh}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title="Choose a Topic"
          showLeft
          onLeftPress={() => this.props.navigation.pop()}
        />
        {this.renderBody()}
      </View>
    );
  }
}

ChooseTopicScreen.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  getSubscribedTopics: PropTypes.func.isRequired,
  choosePostTopic: PropTypes.func.isRequired,
  subscribed: PropTypes.array.isRequired,
  startTopicLoading: PropTypes.func.isRequired,
  stopTopicLoading: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.topics.loading,
  refreshing: state.topics.refreshing,
  post_topic: state.topics.post_topic,
  subscribed: state.topics.subscribed,
});

export default connect(mapStateToProps, {
  getSubscribedTopics,
  choosePostTopic,
  startTopicLoading,
  stopTopicLoading,
})(ChooseTopicScreen);
