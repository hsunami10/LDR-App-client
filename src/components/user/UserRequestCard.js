import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage, FullScreenLoading } from '../../components/common';
import RedX from '../../assets/images/red_x.png';
import GreenV from '../../assets/images/green_check.png';

// NOTE: Only for entering in codes
// profile_pic, username, date_joined, check and x for accept / reject
const UserRequestCard = ({ user, loading, message, cancelResult, acceptResult }) => {
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
             onPress={() => null}
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

           <View style={styles.actionStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={RedX}
              type="opacity"
              onPress={cancelResult}
            />
            <ClickableImage
              width={30}
              height={30}
              image={GreenV}
              type="opacity"
              onPress={acceptResult}
            />
           </View>
         </View>
       ) :
       <Text>{message}</Text>
     }
   </View>
 );
};

UserRequestCard.propTypes = {
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

export default UserRequestCard;
