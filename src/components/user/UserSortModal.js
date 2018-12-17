import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { View, Button, StyleSheet, Platform } from 'react-native';

// 'Recently Joined', 'Popular'
const UserSortModal = ({ isVisible, onChoiceSelect, selected }) => (
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
        title="Recently Joined"
        onPress={() => onChoiceSelect('Recently Joined')}
        color={selected === 'Recently Joined' ? 'purple' : null}
      />
      <Button
        title="Oldest"
        onPress={() => onChoiceSelect('Oldest')}
        color={selected === 'Oldest' ? 'purple' : null}
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

UserSortModal.propTypes = {
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

export default UserSortModal;
