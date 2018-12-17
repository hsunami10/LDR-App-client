import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/common/DataList';
import { NO_DISCOVER_USERS_MSG } from '../../../constants/noneMessages';
import { orderToArrData } from '../../../assets/helpers/misc';
import { getDiscoverUsers } from '../../../actions/DiscoverActions';

class DiscoverUserScreen extends Component {
  state = {
    height: 0,
    order: 'date_joined',
    direction: 'DESC'
  }

  componentDidMount() {
    this.props.getDiscoverUsers(
      this.props.id,
      false,
      0,
      this.state.order,
      this.state.direction,
      moment().unix(),
      this.props.parentNavigation
    );
  }

  paginateData = () => {
    let benchmark;
    if (this.state.order === 'date_joined') {
      benchmark = this.props.users[0].date_joined;
    } else if (this.state.order === 'num_friends') {
      benchmark = this.props.users[0].num_friends;
    }
    this.props.getDiscoverUsers(
      this.props.id,
      null,
      0,
      this.state.order,
      this.state.direction,
      benchmark,
      this.props.parentNavigation
    );
  }

  handleRefresh = () => this.props.getDiscoverUsers(this.props.id, true, 0, this.state.order, this.state.direction, moment().unix(), this.props.parentNavigation);

  handleSortUsers = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getDiscoverUsers(
      this.props.id,
      true,
      0,
      order,
      direction,
      moment().unix(),
      this.props.parentNavigation
    );
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
        type="users_verbose"
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
        flatList
        data={this.props.users}
        empty={this.props.users.length === 0}
        message={NO_DISCOVER_USERS_MSG}
        enableSorting
        sortData={this.handleSortUsers}
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
  getDiscoverUsers: PropTypes.func.isRequired,

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

export default connect(mapStateToProps, { getDiscoverUsers })(DiscoverUserScreen);
