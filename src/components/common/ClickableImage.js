import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import NoImage from '../../assets/images/no_image.jpg';

export const ClickableImage = ({ width, height, onPress, image, type, style }) => {
  if (type === 'opacity') {
    return (
      <TouchableOpacity style={[{ width, height }, style || {}]} onPress={onPress}>
        <Image
          style={[{ width, height }, style || {}]}
          source={image ? { uri: image } : NoImage}
        />
      </TouchableOpacity>
    );
  } else if (type === 'highlight') {
    return (
      <TouchableHighlight style={[{ width, height }, style || {}]} onPress={onPress}>
        <Image
          style={[{ width, height }, style || {}]}
          source={image ? { uri: image } : NoImage}
        />
      </TouchableHighlight>
    );
  } else if (type === 'none') {
    return (
      <TouchableWithoutFeedback style={[{ width, height }, style || {}]} onPress={onPress}>
        <Image
          style={[{ width, height }, style || {}]}
          source={image ? { uri: image } : NoImage}
        />
      </TouchableWithoutFeedback>
    );
  }
  return null;
};

ClickableImage.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  image: PropTypes.string,
  type: PropTypes.oneOf(['opacity', 'highlight', 'none']).isRequired,
  style: PropTypes.object
};
