import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { View, Button, StyleSheet, Platform } from 'react-native';

// 'Newest', 'Popular'
const PostSortModal = ({ isVisible, onChoiceSelect, selected }) => (
  <Modal
    animationIn="fadeIn"
    animationOut="fadeOut"
    style={styles.modalStyle}
    isVisible={isVisible}
    onBackdropPress={Platform.OS === 'android' ? () => onChoiceSelect(null) : undefined}
    hideModalContentWhileAnimating
  >
    <View style={styles.contentStyle}>
      <Button
        title="Newest"
        onPress={() => onChoiceSelect('Newest')}
        color={selected === 'Newest' ? 'purple' : null}
      />
      <Button
        title="Popular"
        onPress={() => onChoiceSelect('Popular')}
        color={selected === 'Popular' ? 'purple' : null}
      />
      <Button
        title="Close"
        onPress={() => onChoiceSelect(null)}
        color="red"
      />
    </View>
  </Modal>
);

PostSortModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onChoiceSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    alignSelf: 'center'
  },
  contentStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 200,
    width: 200,
    borderRadius: 10
  }
});

export default PostSortModal;