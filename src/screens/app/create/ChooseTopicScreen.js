import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { StandardHeader } from '../../../components/common';
import TopicsList from '../../../components/topic/TopicsList';
import { choosePostTopic } from '../../../actions/TopicActions';

const subscribedTopics = [
  {
    id: 'kjsadflkjasfd',
    name: 'First Dates',
    topic_pic: null,
    // description: 'First dates are stressful. Share your experiences and advice here!',
    // date_created: Date.now(),
    num_subscribers: 39
  },
  {
    id: 'asdkfjalskfd',
    name: 'Gifts',
    topic_pic: null,
    // description: 'Gifts are very important for spicing up relationships. Share gift ideas and ask for advice here!',
    // date_created: Date.now(),
    num_subscribers: 26
  },
  {
    id: 'oijfeifjsaldkfsd',
    name: 'Online',
    topic_pic: null,
    // description: 'Online dating is becoming more and more prevalent. Feel free to ask for advice here!',
    // date_created: Date.now(),
    num_subscribers: 14
  },
  {
    id: 'soeiwfjdisfsd',
    name: 'Vacations',
    topic_pic: null,
    // description: 'You can find many vacation ideas and advice giving here!',
    // date_created: Date.now(),
    num_subscribers: 482
  }
];

class ChooseTopicScreen extends Component {
  componentDidMount() {
    // TODO: Get subscribed topics from database here
    // this.props.getSubscribedTopics(this.props.id);
  }

  // No handle for navigation in componentWillUnmount because there was no change navigating here

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
          sectionData={[subscribedTopics]}
        />
      </View>
    );
  }
}

ChooseTopicScreen.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  choosePostTopic: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.topics.loading,
  post_topic: state.topics.post_topic
});

export default connect(mapStateToProps, { choosePostTopic })(ChooseTopicScreen);
