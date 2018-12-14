import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getSubscribedTopics } from '../../../actions/TopicActions';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/DataList';
import { NO_SUBSCRIBED_TOPICS_MSG } from '../../../constants/noneMessages';

class TopicListScreen extends Component {
  componentDidMount() {
    this.props.getSubscribedTopics(this.props.id, false, 'lowercase_name', 'ASC');
  }

  handleRefresh = () => this.props.getSubscribedTopics(this.props.id, true, 'lowercase_name', 'ASC')

  handleTopicSelect = topic => {
    console.log('show topic screen');
    console.log(topic);
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
      <DataList
        type="topics"
        flatList
        message={NO_SUBSCRIBED_TOPICS_MSG}
        data={this.props.subscribed}
        empty={this.props.subscribed.length === 0}
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
