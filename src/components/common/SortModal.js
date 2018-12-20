import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { View, Button, StyleSheet, Platform } from 'react-native';
import { ListOrders } from '../../constants/variables';

export class SortModal extends Component {
  // Map over constant object to get the text, order, and direction
  renderActions = () => {
    const types = Object.keys(ListOrders[this.props.type]);
    return types.map(key => {
      if (key === 'default') {
        return null;
      }
      const obj = ListOrders[this.props.type][key];
      return (
        <Button
          key={this.props.type + key}
          title={obj.text}
          onPress={() => this.props.onChoiceSelect(obj.text, obj.order, obj.direction)}
          color={this.props.selected === obj.text ? 'purple' : null}
        />
      );
    });
  }

  render() {
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modalStyle}
        isVisible={this.props.isVisible}
        onBackdropPress={Platform.OS === 'android' ? () => this.props.onChoiceSelect(null, '', '') : undefined}
        hideModalContentWhileAnimating
      >
        <View style={styles.contentStyle}>
          {this.renderActions()}
          <Button
            title="Close"
            onPress={() => this.props.onChoiceSelect(null, '', '')}
            color="red"
          />
        </View>
      </Modal>
    );
  }
}

SortModal.propTypes = {
  type: PropTypes.oneOf(['posts', 'users', 'topics']).isRequired,
  isVisible: PropTypes.bool.isRequired,
  onChoiceSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
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
