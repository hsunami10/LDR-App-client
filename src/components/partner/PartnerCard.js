import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage, FullScreenLoading } from '../../components/common';
import RedX from '../../assets/images/red_x.png';
import GreenV from '../../assets/images/green_check.png';

const fakeUser = {
  id: '0aa1e4d0-d006-4a0c-9e3e-3fa04c8080c1',
  username: 'asdf',
  profile_pic: 'images/profiles/0aa1e4d0-d006-4a0c-9e3e-3fa04c8080c1.JPG',
  date_joined: 1542516387
};

// NOTE: Only for entering in codes
// profile_pic, username, date_joined, check and x for accept / reject
const PartnerCard = ({ user, loading, cancelResult, acceptResult }) => {
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
       fakeUser ?
       (
         <View style={styles.cardContainerStyle}>
           <ClickableImage
             width={40}
             height={40}
             type="none"
             onPress={() => null}
             image={fakeUser.profile_pic ? `${ROOT_URL}/${fakeUser.profile_pic}` : null}
           />

           <View style={styles.textViewStyle}>
             <Text
               style={{ fontWeight: 'bold' }}
               suppressHighlighting
             >
               {fakeUser.username}
             </Text>
             <Text
               style={{ fontSize: 12 }}
               suppressHighlighting
             >{`Joined ${moment.unix(fakeUser.date_joined).format('MM/DD/YYYY')}`}</Text>
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
       <Text>No Partner Found</Text>
     }
   </View>
 );
};

PartnerCard.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  cancelResult: PropTypes.func.isRequired,
  acceptResult: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: 'lightgray'
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10
  },
  actionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PartnerCard;