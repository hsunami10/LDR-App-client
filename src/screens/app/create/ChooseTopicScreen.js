import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import TopicsList from '../../../components/topic/TopicsList';
import { getSubscribedTopics, choosePostTopic, startTopicLoading, stopTopicLoading } from '../../../actions/TopicActions';
import { NO_SUBSCRIBED_TOPICS_MSG } from '../../../constants/noneMessages';

class ChooseTopicScreen extends Component {
  componentDidMount() {
    this.props.getSubscribedTopics(this.props.id, false);
  }

  // No handle for navigation in componentWillUnmount because there was no change navigating here
  componentWillUnmount() {
    if (this.props.loading) {
      this.props.stopTopicLoading();
    }
  }

  handleTopicSelect = topic => {
    this.props.choosePostTopic(topic);
    this.props.navigation.pop();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title="Choose a Topic"
          showLeft
          onLeftPress={() => this.props.navigation.pop()}
        />
        <TopicsList
          sectioned
          onTopicSelect={this.handleTopicSelect}
          sectionTitles={['Subscribed Topics']}
          sectionData={[this.props.subscribed]}
          emptyMessages={[NO_SUBSCRIBED_TOPICS_MSG]}
        />
        <FullScreenLoading loading={this.props.loading} allowTouchThrough />
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
  stopTopicLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.topics.loading,
  post_topic: state.topics.post_topic,
  subscribed: state.topics.subscribed
});

export default connect(mapStateToProps, {
  getSubscribedTopics,
  choosePostTopic,
  startTopicLoading,
  stopTopicLoading,
})(ChooseTopicScreen);
