import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Dimensions, Animated, Keyboard } from 'react-native';
import { Button, MultiLineInput } from '../../../components/common';
import textStyles from '../../../constants/styles/text';
import { choosePostTopic } from '../../../actions/TopicActions';

// TODO: Location
// TODO: Handle animating height with keyboard
class CreatePostScreen extends Component {
  componentDidMount() {
    this.props.choosePostTopic(this.props.topic);
  }

  render() {
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.centerItems}>
          <Button onPress={() => this.props.navigation.navigate('ChooseTopic')}>
            <Text>{this.props.post_topic.name}</Text>
          </Button>
          {/* <Button onPress={() => console.log('enable location and get coordinates - long lat format for postgis')}>
            <Text>{'Enable Location (optional)'}</Text>
          </Button> */}
          <MultiLineInput
            placeholder="Body"
            value={this.props.body}
            onChangeText={this.props.handleChangeBody}
            showBorder={this.props.error.type === 'body'}
            borderColor="red"
            width={Dimensions.get('window').width - 40}
            height={200}
          />
          <Text style={textStyles.errorTextStyle}>{this.props.error.msg}</Text>
        </View>
      </Animated.ScrollView>
    );
  }
}

CreatePostScreen.propTypes = {
  handleChangeBody: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  topic: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  choosePostTopic: PropTypes.func.isRequired,
  post_topic: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  post_topic: state.topics.post_topic
});

export default connect(mapStateToProps, { choosePostTopic })(CreatePostScreen);
