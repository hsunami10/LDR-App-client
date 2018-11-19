import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, SectionList } from 'react-native';
import TopicCard from './TopicCard';

// TODO: Finish post cards - to show in feed
class TopicsList extends Component {
  renderTopics = ({ item }) => (
    <TopicCard
      key={item.id}
      topic={item}
      onPress={() => this.props.onTopicSelect(item)}
    />
  )

  renderSections = () => {
    const result = new Array(this.props.sectionTitles.length);
    for (let i = 0, len = this.props.sectionTitles.length; i < len; i++) {
      result[i] = {
        title: <Text style={styles.sectionTitleStyle}>{this.props.sectionTitles[i]}</Text>,
        data: this.props.sectionData[i]
      };
    }
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
  onTopicSelect: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  sectionTitleStyle: {
    backgroundColor: 'white'
  }
});

export default TopicsList;
