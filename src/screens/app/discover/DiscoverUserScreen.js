import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/common/DataList';
import { NO_DISCOVER_USERS_MSG } from '../../../constants/noneMessages';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import { getDiscoverUsers } from '../../../actions/DiscoverActions';
import { SortListTypes } from '../../../constants/variables';

class DiscoverUserScreen extends Component {
  state = {
    height: 0,
    order: SortListTypes.users.default.order,
    direction: SortListTypes.users.default.direction,
    lastID: ''
  }

  componentDidMount() {
    this.props.getDiscoverUsers(
      this.props.id,
      false,
      this.state.order,
      this.state.direction,
      '',
      '',
      this.props.parentNavigation
    );
  }

  paginateData = () => {
    const length = this.props.users.length;
    const lastID = this.props.users[length - 1].id;
    const lastData = this.props.users[length - 1][this.state.order];
    if (this.state.lastID !== lastID) {
      this.props.getDiscoverUsers(
        this.props.id,
        null,
        this.state.order,
        this.state.direction,
        lastID,
        lastData,
        this.props.parentNavigation
      );
    }
    this.setState(() => ({ lastID }));
  }

  handleRefresh = () => this.props.getDiscoverUsers(this.props.id, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation);

  handleSortUsers = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getDiscoverUsers(
      this.props.id,
      true,
      order,
      direction,
      '',
      '',
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
        type="users"
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

const mapStateToProps = state => ({
  id: state.auth.id,
  users: orderToArrData(state.discover.users.order, state.social.all_users),
  initial_loading: state.discover.users.initial_loading,
  refreshing: state.discover.users.refreshing,
  keepPaging: state.discover.users.keepPaging,
});

export default connect(mapStateToProps, { getDiscoverUsers })(DiscoverUserScreen);
