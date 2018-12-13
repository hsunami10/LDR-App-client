import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, SectionList, FlatList, RefreshControl } from 'react-native';
import TopicCard from './TopicCard';
import { requireWhenPropExists } from '../../assets/helpers/errors/proptypes';
import { NO_SUBSCRIBED_TOPICS_MSG } from '../../constants/noneMessages';

// TODO: Handle no data for a certain section (no subscribed topics)
class TopicsList extends Component {
  renderTopics = ({ item }) => {
    if (typeof item === 'string') { // No data for section
      return <Text style={{ alignSelf: 'center' }}>{item}</Text>;
    }
    return (
      <TopicCard
        key={item.id}
        topic={item}
        onPress={() => this.props.onTopicSelect(item)}
      />
    );
  }

  renderMessage = ({ item }) => (
    <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{item.text}</Text>
  )

  renderSections = () => {
    const result = new Array(this.props.sectionTitles.length);
    for (let i = 0, len = this.props.sectionTitles.length; i < len; i++) {
      result[i] = {
        title: <Text style={styles.sectionTitleStyle}>{this.props.sectionTitles[i]}</Text>,
        data: this.props.sectionData[i].length === 0 ? [this.props.emptyMessages[i]] : this.props.sectionData[i]
      };
    }
    return result;
  }

  renderSectionHeader = ({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{title}</Text>
  )

  render() {
    if (this.props.sectioned) {
      return (
        <SectionList
          renderItem={this.renderTopics}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.renderSections()}
          keyExtractor={(item, index) => item + index}
          scrollEventThrottle={this.props.scrollEventThrottle || 16}
          onEndReachedThreshold={0}
        />
      );
    }
    return (
      <FlatList
        data={this.props.empty ? [{ id: 'foo', text: NO_SUBSCRIBED_TOPICS_MSG }] : this.props.data}
        renderItem={this.props.empty ? this.renderMessage : this.renderTopics}
        keyExtractor={comment => comment.id}
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        handleRefresh={this.props.handleRefresh}
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.handleRefresh}
          />
        }
      />
    );
  }
}

TopicsList.propTypes = {
  sectioned: PropTypes.bool,
  onTopicSelect: PropTypes.func.isRequired,
  scrollEventThrottle: PropTypes.number,

  empty: PropTypes.bool,
  data: PropTypes.array,
  handleRefresh: PropTypes.func,
  refreshing: PropTypes.bool,

  sectionTitles: (props, propName, componentName) => requireWhenPropExists('sectioned', props, propName, componentName, 'object'),
  sectionData: (props, propName, componentName) => requireWhenPropExists('sectioned', props, propName, componentName, 'object'),
  emptyMessages: (props, propName, componentName) => requireWhenPropExists('sectioned', props, propName, componentName, 'object'),
};

const styles = StyleSheet.create({
  sectionTitleStyle: {
    backgroundColor: 'white'
  }
});

export default TopicsList;
