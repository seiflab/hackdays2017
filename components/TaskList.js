import Swipeable from 'react-native-swipeable';
import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';

import TaskItem from './TaskItem';
import ModalDialog from './ModalDialog';

export default class TaskList extends React.Component {

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => {
    const completeBtn = (
      <View style={[styles.leftContent, {backgroundColor: '#007aff'}]}>
        <Text style={styles.whiteText}>Complete</Text>
      </View>
    );
    const claimBtn =  (
      <View style={[styles.rightContent, {backgroundColor: '#f09a38', paddingLeft: 30}]}>
        <Text style={styles.whiteText}>Claim</Text>
      </View>
    );
    const dueDateBtn =  (
      <View style={[styles.rightContent, {backgroundColor: '#4b70a6'}]}>
        <Text style={styles.whiteText}>Due Date</Text>
      </View>
    );
    const rightButtons = [
      claimBtn,
      dueDateBtn
    ];

    return (
    <Swipeable style={styles.item} leftContent={completeBtn} rightButtons={rightButtons} rightButtonWidth={100}>
      <TaskItem openModal={this.setModalVisible} {...item} />
    </Swipeable>
  );
};

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      data: []
    };

    this.setModalVisible = this.setModalVisible.bind(this);
  }

  _fetchData() {
    return fetch('http://localhost:8080/engine-rest/task?sortBy=created&sortOrder=desc')
      .then(response => response.json())
      .then((data) => {
        const mappedData = data.map(dataItem => Object.assign({}, dataItem, { key: dataItem.id }));
        this.setState({ data: mappedData });
      });
  }

  componentDidMount() {
    this._fetchData();
  }

  setModalVisible(visible) {
    this.refs.modal.setModalVisible(visible);
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this._fetchData().then(() => {
      this.setState({isRefreshing: false});
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE"
        }}
      />
    )};

  render() {
    return (
      <View style={styles.container}>
        <ModalDialog ref="modal"/>
        <FlatList
          ListEmptyComponent={
            <Text style={styles.emptyList}>Sorry. No tasks available to work on.</Text>
          }
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          data={this.state.data}
          ItemSeparatorComponent={this.renderSeparator}
          refreshControl={
             <RefreshControl
                 refreshing={this.state.isRefreshing}
                 onRefresh={this._onRefresh.bind(this)}
                 title="Pull to refresh"
              />
           }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyList: {
    textAlign: 'center',
    paddingTop: 10
  },
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'red',
    padding: 20
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  whiteText: {
    color: 'white'
  }
});
