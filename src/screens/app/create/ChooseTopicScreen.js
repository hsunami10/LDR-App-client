import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard, SectionList } from 'react-native';
import { SearchHeader } from '../../../components/common';

// TODO: Order everything alphabetically automatically
// Don't use SearchHeader at top, have an actual header, then search header below it
// NOTE: Have an option for "none"

class ChooseTopicScreen extends Component {
  state = {
    search: ''
  }

  handleCancelPress = () => {
    Keyboard.dismiss();
    this.setState(() => ({ search: '' }));
  }

  handleChangeText = search => this.setState(() => ({ search }))

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search Topics..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
          returnKeyType="search"
        />
        <SectionList
          renderItem={
            ({ item, index, section }) =>
            <Text
              key={index}
              onPress={() => {
                // TODO: Update global state to pass the topic name to CreateMainScreen
                console.log(item);
              }}
            >
              {item}
            </Text>
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{title}</Text>
          )}
          sections={[
            { title: <Text style={{ backgroundColor: 'white' }}>Your Topics</Text>, data: ['Your Topic 1', 'Your Topic 2', 'Your Topic 3'] },
            { title: <Text style={{ backgroundColor: 'white' }}>All Topics</Text>, data: ['All Topic 1', 'All Topic 2'] }
          ]}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ChooseTopicScreen;
