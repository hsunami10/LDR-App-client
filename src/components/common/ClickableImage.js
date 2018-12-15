import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import NoImage from '../../assets/images/no_image.jpg';

export const ClickableImage = ({ width, height, onPress, image, type, style, disabled }) => {
  let source;
  if (!image) {
    source = NoImage;
  } else if (typeof image === 'string') {
    source = { uri: image };
  } else if (typeof image === 'object') {
    source = image;
  } else if (typeof image === 'number') {
    source = image;
  }

  if (type === 'opacity') {
    return (
      <TouchableOpacity
        style={[{ width, height }, style || {}]}
        onPress={onPress}
        disabled={disabled}
      >
        <Image
          style={[{ width, height }, style || {}]}
          source={source}
        />
      </TouchableOpacity>
    );
  } else if (type === 'highlight') {
    return (
      <TouchableHighlight
        style={[{ width, height }, style || {}]}
        onPress={onPress}
        disabled={disabled}
      >
        <Image
          style={[{ width, height }, style || {}]}
          source={source}
        />
      </TouchableHighlight>
    );
  } else if (type === 'none') {
    return (
      <TouchableWithoutFeedback
        style={[{ width, height }, style || {}]}
        onPress={onPress}
        disabled={disabled}
      >
        <Image
          style={[{ width, height }, style || {}]}
          source={source}
        />
      </TouchableWithoutFeedback>
    );
  }
  return null;
};

ClickableImage.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number
  ]),
  type: PropTypes.oneOf(['opacity', 'highlight', 'none']).isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool
};
