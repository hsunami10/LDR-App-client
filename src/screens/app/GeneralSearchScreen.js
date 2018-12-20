import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated, StyleSheet, Dimensions, Platform, Keyboard } from 'react-native';
import { orderToArrData } from '../../assets/helpers/preprocess';
import SearchResultScreen from './search/SearchResultScreen';
import SuggestionList from '../../components/search/suggestions/SuggestionList';
import { FullScreenLoading } from '../../components/common';
import {
  searchTerm,
  removeUserSearch,
  getUserSearches,
} from '../../actions/SearchActions';
import {
  DEFAULT_IOS_BACKGROUND_COLOR,
  DEFAULT_ANDROID_BACKGROUND_COLOR,
} from '../../constants/variables';

class GeneralSearchScreen extends Component {
  handleSuggestionPress = term => {
    this.props.fillSearch(term);
    Keyboard.dismiss();
    this.props.searchTerm(this.props.type, this.props.id, term);
  }

  handleRemovePress = id => this.props.removeUserSearch(this.props.type, id)
  handleRefresh = () => this.props.getUserSearches(this.props.id, this.props.term, true, this.props.type)

  renderBody() {
    if (this.props.initial_loading) {
      return <FullScreenLoading height={this.props.height} loading />;
    } else if (this.props.showTabs) {
      return (
        <SearchResultScreen
          type={this.props.type}
          navigation={this.props.navigation}
          parentNavigation={this.props.parentNavigation}
        />
      );
    }
    return (
      <SuggestionList
        data={this.props.suggestions}
        refreshing={this.props.refreshing}
        onRefresh={this.handleRefresh}
        onPress={this.handleSuggestionPress}
        onRemovePress={this.handleRemovePress}
        height={this.props.height}
        term={this.props.term}
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
  fillSearch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchTerm: PropTypes.func.isRequired,
  removeUserSearch: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  term: PropTypes.string.isRequired,
  getUserSearches: PropTypes.func.isRequired,
  showTabs: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  searchViewStyle: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? DEFAULT_IOS_BACKGROUND_COLOR : DEFAULT_ANDROID_BACKGROUND_COLOR,
    width: Dimensions.get('window').width
  }
});

const mapStateToProps = (state, ownProps) => ({
  id: state.auth.id,
  suggestions: orderToArrData(state.search[ownProps.type].suggestions.order, state.search[ownProps.type].suggestions.data),
  refreshing: state.search[ownProps.type].suggestions.refreshing,
  term: state.search[ownProps.type].term,
  showTabs: state.search[ownProps.type].showTabs,
  initial_loading: state.search[ownProps.type].suggestions.initial_loading
});

export default connect(mapStateToProps, {
  searchTerm,
  removeUserSearch,
  getUserSearches,
})(GeneralSearchScreen);
