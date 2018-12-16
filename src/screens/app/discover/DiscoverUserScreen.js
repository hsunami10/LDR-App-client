import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/common/DataList';
import { NO_DISCOVER_USERS_MSG } from '../../../constants/noneMessages';
import { orderToArrData } from '../../../assets/helpers/misc';

class DiscoverUserScreen extends Component {
  state = {
    height: 0,
    order: 'date_posted',
    direction: 'DESC'
  }

  componentDidMount() {
    console.log('grab discover UserSortModal here');
  }

  paginateData = () => console.log('page data here')

  handleRefresh = () => console.log('handle refresh here')

  handleSortPosts = (order, direction) => {
    this.setState(() => ({ order, direction }));
    console.log('sort posts here');
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.state.height === 0) { // Get rid of small jump in spinning icon
      return null;
    } else if (this.props.initial_loading) { // Only true once, on componentDidMount
      return <FullScreenLoading height={this.state.height} loading />;
    }
    return (
      <DataList
        type="users_descriptive"
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
        flatList
        data={this.props.users}
        empty={this.props.users.length === 0}
        message={NO_DISCOVER_USERS_MSG}
        enableSorting
        sortData={this.handleSortPosts}
        enablePaging
        paginateData={this.paginateData}
        keepPaging={this.props.keepPaging}
        height={this.state.height}
        enableRefresh
        refreshing={this.props.refreshing}
        handleRefresh={this.handleRefresh}
      />
  );
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={this.handleLayout}
      >
        {this.renderBody()}
      </View>
    );
  }
}

DiscoverUserScreen.propTypes = {
  id: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  keepPaging: PropTypes.bool.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => {
  const users = orderToArrData(state.discover.users.order, state.social.all_users);
  return {
    id: state.auth.id,
    users,
    initial_loading: state.discover.users.initial_loading,
    refreshing: state.discover.users.refreshing,
    keepPaging: state.discover.users.keepPaging,
  };
};

export default connect(mapStateToProps, null)(DiscoverUserScreen);
