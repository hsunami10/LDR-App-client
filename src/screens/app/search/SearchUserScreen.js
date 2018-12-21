import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { getSearchUsers } from '../../../actions/SearchActions';
import DataList from '../../../components/common/DataList';
import { FullScreenLoading } from '../../../components/common';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import { NO_SEARCH_USERS } from '../../../constants/noneMessages';
import { ListOrders } from '../../../constants/variables';

class SearchUserScreen extends Component {
  state = {
    height: 0,
    order: ListOrders.users.default.order,
    direction: ListOrders.users.default.direction
  }

  paginateData = () => {
    const length = this.props.users.length;
    const lastID = this.props.users[length - 1].id;
    const lastData = this.props.users[length - 1][this.state.order];
    this.props.getSearchUsers(
      this.props.id,
      this.props.type,
      this.props.term,
      null,
      this.state.order,
      this.state.direction,
      lastID,
      lastData,
      this.props.parentNavigation
    );
  }

  handleRefresh = () => this.props.getSearchUsers(this.props.id, this.props.type, this.props.term, true, this.state.order, this.state.direction, '', '', this.props.parentNavigation)

  handleSortUsers = (order, direction) => {
    this.setState(() => ({ order, direction }));
    this.props.getSearchUsers(
      this.props.id,
      this.props.type,
      this.props.term,
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
    if (this.state.height === 0) {
      return null;
    } else if (this.props.initial_loading) {
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
        message={`${NO_SEARCH_USERS} ${this.props.term}.`}
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

SearchUserScreen.propTypes = {
  id: PropTypes.string.isRequired,
  getSearchUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  term: PropTypes.string.isRequired,

  type: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = (state, ownProps) => ({
  id: state.auth.id,
  users: orderToArrData(state.search[ownProps.type].results.users.order, state.social.all_users),
  initial_loading: state.search[ownProps.type].results.initial_loading,
  refreshing: state.search[ownProps.type].results.users.refreshing,
  keepPaging: state.search[ownProps.type].results.users.keepPaging,
  term: state.search[ownProps.type].term
});

export default connect(mapStateToProps, {
  getSearchUsers
})(SearchUserScreen);
