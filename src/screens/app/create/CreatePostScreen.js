import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button, MultiLineInput, SpinnerOverlay } from '../../../components/common';
import { errorTextStyle } from '../../../constants/styles/text';

class CreatePostScreen extends Component {
  render() {
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.centerItems}>
          <Button onPress={() => this.props.navigation.navigate('ChooseTopic')}>
            <Text>{this.props.topic}</Text>
          </Button>
          <Button onPress={() => console.log('enable location')}>
            <Text>{'Enable Location (optional)'}</Text>
          </Button>
          <MultiLineInput
            placeholder="Body"
            value={this.props.body}
            onChangeText={this.props.handleChangeBody}
            showBorder={this.props.error.type === 'body'}
            borderColor="red"
            width={Dimensions.get('window').width - 40}
            height={200}
          />
          <Text style={errorTextStyle}>{this.props.error.msg}</Text>
          <SpinnerOverlay visible={this.props.loading} />
        </View>
      </Animated.ScrollView>
    );
  }
}

CreatePostScreen.propTypes = {
  handleChangeBody: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center'
  }
});

export default CreatePostScreen;
