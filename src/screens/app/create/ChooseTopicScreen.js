import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import TopicsList from '../../../components/topic/TopicsList';
import { getSubscribedTopics, choosePostTopic } from '../../../actions/TopicActions';
import { stopLoading } from '../../../actions/LoadingActions';

class ChooseTopicScreen extends Component {
  componentDidMount() {
    if (!this.props.sub_fetched) {
      this.props.getSubscribedTopics(this.props.id);
    }
  }

  // No handle for navigation in componentWillUnmount because there was no change navigating here
  componentWillUnmount() {
    if (this.props.loading) {
      this.props.stopLoading();
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
          onTopicSelect={this.handleTopicSelect}
          sectionTitles={['Subscribed Topics']}
          sectionData={[this.props.subscribed]}
          emptyMessages={['You are not currently subscribed to any topics.']}
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
  stopLoading: PropTypes.func.isRequired,
  sub_fetched: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.loading,
  post_topic: state.topics.post_topic,
  subscribed: state.topics.subscribed,
  sub_fetched: state.topics.sub_fetched
});

export default connect(mapStateToProps, {
  getSubscribedTopics,
  choosePostTopic,
  stopLoading
})(ChooseTopicScreen);
