import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, SectionList } from 'react-native';
import TopicCard from './TopicCard';

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

  renderSections = () => {
    const result = new Array(this.props.sectionTitles.length);
    for (let i = 0, len = this.props.sectionTitles.length; i < len; i++) {
      result[i] = {
        title: <Text style={styles.sectionTitleStyle}>{this.props.sectionTitles[i]}</Text>,
        data: this.props.sectionData[i].length === 0 ? [this.props.emptyMessages[i]] : this.props.sectionData[i]
      };
    }
    console.log(result);
    return result;
  }

  renderSectionHeader = ({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{title}</Text>
  )

  render() {
    return (
      <SectionList
        renderItem={this.renderTopics}
        renderSectionHeader={this.renderSectionHeader}
        sections={this.renderSections()}
        keyExtractor={(item, index) => item + index}
      />
    );
  }
}

TopicsList.propTypes = {
  sectionTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  sectionData: PropTypes.arrayOf(PropTypes.array).isRequired,
  emptyMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTopicSelect: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  sectionTitleStyle: {
    backgroundColor: 'white'
  }
});

export default TopicsList;
