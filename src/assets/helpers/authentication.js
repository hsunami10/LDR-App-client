import { removeCredentials, logOutUser } from '../../actions/AuthActions';
import { navigateToRoute } from '../../actions/NavigationActions';
import { handleError } from './errors';

// Helper function to handle logging out all users
export const logOut = navigation => dispatch => {
  removeCredentials()
    .then(() => {
      dispatch(logOutUser());
      dispatch(navigateToRoute('Welcome'));
      navigation.navigate('Welcome');
    })
    .catch(error => {
      handleError(new Error(error.message), true);
    });
};
