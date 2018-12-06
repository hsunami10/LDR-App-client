import React from 'react';
import PropTypes from 'prop-types';
import PartnerCard from './PartnerCard';
import FriendCard from './FriendCard';
import { userCardPropTypesError } from '../../assets/helpers';

const UserCard = props => {
  switch (props.type) {
    case 'partner':
      return (
        <PartnerCard
          user={props.user}
          loading={props.loading}
          message={props.message}
          cancelResult={props.cancelResult}
          acceptResult={props.acceptResult}
        />
      );
    case 'user':
      return null;
    case 'friend':
      return (
        <FriendCard
          user={props.user}
          onPress={props.onPress}
        />
      );
    default:
      return null;
  }
};

// https://stackoverflow.com/questions/42299335/react-props-set-isrequired-on-a-prop-if-another-prop-is-null-empty
UserCard.propTypes = {
  type: PropTypes.oneOf(['partner', 'user', 'friend']).isRequired,

  user: (props, propName, componentName) => userCardPropTypesError(['friend', 'user'], props, propName, componentName, 'object'),
  onPress: (props, propName, componentName) => userCardPropTypesError(['friend', 'user'], props, propName, componentName, 'function'),

  // type = partner
  loading: (props, propName, componentName) => userCardPropTypesError(['partner'], props, propName, componentName, 'boolean'),
  message: (props, propName, componentName) => userCardPropTypesError(['partner'], props, propName, componentName, 'string'),
  cancelResult: (props, propName, componentName) => userCardPropTypesError(['partner'], props, propName, componentName, 'function'),
  acceptResult: (props, propName, componentName) => userCardPropTypesError(['partner'], props, propName, componentName, 'function'),
};

export default UserCard;
