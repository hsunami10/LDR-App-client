import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated, StyleSheet, Dimensions, Platform } from 'react-native';
import { orderToArrData } from '../../assets/helpers/preprocess';
import SearchResultTabView from '../../components/search/SearchResultTabView';
import SuggestionList from '../../components/search/suggestions/SuggestionList';
import { FullScreenLoading } from '../../components/common';
import {
  searchTerm,
  removeUserSearch,
} from '../../actions/SearchActions';
import {
  DEFAULT_IOS_BACKGROUND_COLOR,
  DEFAULT_ANDROID_BACKGROUND_COLOR,
} from '../../constants/variables';

/*
To show when the user clicks on search, before typing anything
user_searches
suggestion: {
  id,
  user_id,
  search_term,
  date_searched,
}

To show when the user types something
all_searches
suggestion: {
  id,
  search_term,
  num_searches
}
 */
class GeneralSearchScreen extends Component {
  handleSuggestionPress = (id, term) => this.props.searchTerm(this.props.type, id, term)
  handleRemovePress = id => this.props.removeUserSearch(this.props.type, id)

  renderBody() {
    if (this.props.initial_loading) {
      return <FullScreenLoading height={this.props.height} loading />;
    } else if (this.props.searched) {
      return <SearchResultTabView type={this.props.type} />;
    }
    return (
      <SuggestionList
        data={this.props.suggestions}
        onPress={this.handleSuggestionPress}
        onRemovePress={this.handleRemovePress}
        height={this.props.height}
      />
    );
  }

  render() {
    return (
      <Animated.View
        style={[styles.searchViewStyle, {
          display: this.props.display,
          opacity: this.props.opacity,
          height: this.props.height
        }]}
      >
        {this.renderBody()}
      </Animated.View>
    );
  }
}

GeneralSearchScreen.propTypes = {
  type: PropTypes.oneOf(['home', 'discover']).isRequired,
  display: PropTypes.string.isRequired,
  opacity: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,

  searched: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchTerm: PropTypes.func.isRequired,
  removeUserSearch: PropTypes.func.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  searchViewStyle: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? DEFAULT_IOS_BACKGROUND_COLOR : DEFAULT_ANDROID_BACKGROUND_COLOR,
    width: Dimensions.get('window').width
  }
});

const mapStateToProps = (state, ownProps) => ({
  searched: state.search[ownProps.type].searched,
  suggestions: orderToArrData(state.search[ownProps.type].suggestions.order, state.search[ownProps.type].suggestions.data),
  initial_loading: state.search[ownProps.type].initial_loading,
  refreshing: state.search[ownProps.type].refreshing,
});

export default connect(mapStateToProps, {
  searchTerm,
  removeUserSearch,
})(GeneralSearchScreen);
