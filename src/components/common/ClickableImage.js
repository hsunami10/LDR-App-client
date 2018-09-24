import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import NoImage from '../../assets/images/no_image.jpg';

export const ClickableImage = ({ width, height, onPress, image, type }) => {
  if (type === 'opacity') {
    return (
      <TouchableOpacity style={{ width, height }} onPress={onPress}>
        <Image
          style={{ width, height }}
          source={image || NoImage}
        />
      </TouchableOpacity>
    );
  } else if (type === 'highlight') {
    return (
      <TouchableHighlight style={{ width, height }} onPress={onPress}>
        <Image
          style={{ width, height }}
          source={image || NoImage}
        />
      </TouchableHighlight>
    );
  } else if (type === 'none') {
    return (
      <TouchableWithoutFeedback style={{ width, height }} onPress={onPress}>
        <Image
          style={{ width, height }}
          source={image || NoImage}
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
  image: Image.propTypes.source,
  type: PropTypes.oneOf(['opacity', 'highlight', 'none'])
};