import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Animated, Keyboard } from 'react-native';
import { Button, MultiLineInput } from '../../../components/common';
import AliasPicker from '../../../components/post/AliasPicker';
import { errorTextStyle } from '../../../constants/styles/text';

// TODO: Location
// TODO: Handle animating height with keyboard
const CreatePostScreen = props => (
  <Animated.ScrollView
    scrollEventThrottle={16}
    onScroll={() => Keyboard.dismiss()}
    keyboardShouldPersistTaps="always"
  >
    <View style={styles.centerItems}>
      <Button onPress={() => props.navigation.navigate('ChooseTopic')}>
        <Text>{props.topic}</Text>
      </Button>
      {/* <Button onPress={() => console.log('enable location and get coordinates - long lat format for postgis')}>
        <Text>{'Enable Location (optional)'}</Text>
      </Button> */}
      <MultiLineInput
        placeholder="Body"
        value={props.body}
        onChangeText={props.handleChangeBody}
        showBorder={props.error.type === 'body'}
        borderColor="red"
        width={Dimensions.get('window').width - 40}
        height={200}
      />
      <Text>Choose an Alias (optional)</Text>
      <AliasPicker
        selectedAlias={props.selectedAlias}
        handleAliasChange={props.handleAliasChange}
        aliases={props.aliases}
      />
      <Text style={errorTextStyle}>{props.error.msg}</Text>
    </View>
  </Animated.ScrollView>
);

CreatePostScreen.propTypes = {
  handleChangeBody: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
  selectedAlias: PropTypes.number.isRequired,
  handleAliasChange: PropTypes.func.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center' // NOTE: Uncommenting this makes alias picker disappear
  }
});

export default CreatePostScreen;
