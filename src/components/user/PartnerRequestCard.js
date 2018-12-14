import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage, FullScreenLoading } from '../../components/common';
import UserRequestButtons from './UserRequestButtons';

// NOTE: Only for entering codes
// profile_pic, username, date_joined, v and x for accept / reject
const PartnerRequestCard = ({ user, loading, message, cancelResult, acceptResult }) => {
  if (loading) {
    return (
      <View style={styles.viewStyle}>
        <FullScreenLoading height={60} loading />
      </View>
    );
  }
  return (
   <View style={styles.viewStyle}>
     {
       user ?
       (
         <View style={styles.cardContainerStyle}>
           <ClickableImage
             width={40}
             height={40}
             type="none"
             disabled
             image={user.profile_pic ? `${ROOT_URL}/${user.profile_pic}` : null}
           />

           <View style={styles.textViewStyle}>
             <Text
               style={{ fontWeight: 'bold' }}
               suppressHighlighting
             >
               {user.username}
             </Text>
             <Text
               style={{ fontSize: 12 }}
               suppressHighlighting
             >{`Joined ${moment.unix(user.date_joined).format('MM/DD/YYYY')}`}</Text>
           </View>

           <UserRequestButtons
             onAcceptPress={acceptResult}
             onRejectPress={cancelResult}
           />
         </View>
       ) :
       <Text>{message}</Text>
     }
   </View>
 );
};

PartnerRequestCard.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  cancelResult: PropTypes.func.isRequired,
  acceptResult: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 60
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1
  },
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10
  },
  actionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PartnerRequestCard;
