import Swipeable from 'react-native-swipeable';
import DateTimePicker from 'react-native-modal-datetime-picker';
import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text, TouchableHighlight, ActionSheetIOS, AlertIOS } from 'react-native';

import TaskItem from './TaskItem';
import ModalDialog from './ModalDialog';

const HOSTNAME = 'localhost';

export default class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      dateTime: {
        pickerActive: false,
        currentDate: new Date()
      },
      isRefreshing: false,
      data: []
    };

    this.setModalVisible = this.setModalVisible.bind(this);
  }

  _keyExtractor = (item, index) => item.id;

  updateData(item, attr, value) {
    let itemIndex;
    let data = this.state.data;
    data.find(function (element, index) {
      if (element === item) {
        itemIndex = index;
      }
    });

    data[itemIndex][attr] = value;
    this.setState(this.state);
  }

  _renderItem = ({item}) => {
    let completeBtn = (
      <View style={[styles.leftContent, {backgroundColor: '#007aff'}]}>
        <Text style={styles.whiteText}>Complete</Text>
      </View>
    );

    let claimBtn =  (
      <TouchableHighlight style={[styles.rightContent, {backgroundColor: '#f09a38', paddingLeft: 30}]}
                          underlayColor="#f09a38"
                          onPress={() => {
                            if (item.assignee !== null) {
                              AlertIOS.prompt(
                                'Assignee',
                                null,
                                [
                                  {text: 'Cancel', onPress: () => {
                                    this._postClaimState(item, 'unclaim').then(() => {
                                      this.updateData(item, 'assignee', null);
                                    });
                                  }},
                                  {text: 'Assign', onPress: (assignee) => {
                                    item.assignee = assignee === '' ? null : assignee;
                                    this._postClaimState(item, 'unclaim').then(() => {
                                      this._postClaimState(item, 'claim').then(() => {
                                        this.updateData(item, 'assignee', item.assignee);
                                      })
                                    });
                                    }
                                  },
                                ],
                                'plain-text'
                              );
                            } else {
                              item.assignee = 'demo';
                              this._postClaimState(item, 'claim')
                                .then(() => {
                                  this.updateData(item, 'assignee', 'demo');
                                })
                            }

                            console.log(item.assignee);
                          }}>
        <Text style={styles.whiteText}>{item.assignee !== null ? 'Unclaim' : 'Claim'}</Text>
      </TouchableHighlight>
    );

    const moreActionsBtn =  (
      <TouchableHighlight style={[styles.rightContent, {backgroundColor: '#4b70a6'}]}
                    underlayColor="#4b70a6"
                    onPress={() => this._showActionSheet(item)}>
        <Text style={styles.whiteText}> • • • </Text>
      </TouchableHighlight>
    );

    return (
      <Swipeable style={styles.item} leftContent={completeBtn} rightButtons={[claimBtn, moreActionsBtn]} rightButtonWidth={100}>
        <TaskItem openModal={this.setModalVisible} {...item} />
      </Swipeable>
    );
  }

  _showActionSheet(item) {
    const dueLbl = 'Set due date';
    const followUpLbl = 'Set follow-up date';
    const addGroupsLbl = 'Add groups';
    const cancelLbl = 'Cancel';

    return ActionSheetIOS.showActionSheetWithOptions({
        title: 'More options...',
        options: [dueLbl, followUpLbl, addGroupsLbl, cancelLbl],
        cancelButtonIndex: 3
      },
      (index) => {
        let dateTime = this.state.dateTime;
        dateTime.type = 'due';

        switch (index) {
          case 0:
            dateTime.pickerTitle = dueLbl;
            dateTime.type = 'due';
            break;
          case 1:
            dateTime.pickerTitle = followUpLbl;
            dateTime.type = 'followUp';
            break;
        }

        dateTime.item = item;
        let type = dateTime.type;
        dateTime.currentDate = item === 'null' || item[type] === 'undefined' || item[type] === null ? new Date() : new Date(item[type].slice(0, -5) + 'Z');
        dateTime.pickerActive = index !== 3;
        this.setState(this.state);
      })
  }

  _putTaskUpdate(item) {
    console.log(item);
    return fetch('http://' + HOSTNAME + ':8082/engine-rest/task/' + item.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item)
    });
  }

  _postClaimState(item, action) {
    return fetch('http://' + HOSTNAME + ':8082/engine-rest/task/' + item.id + '/' + action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId: item.assignee})
    }).then(console.log);
  }

  fetchData() {
    return fetch('http://' + HOSTNAME + ':8082/engine-rest/task?sortBy=created&sortOrder=desc')
      .then(response => response.json())
      .then((data) => {
        const mappedData = data.map(dataItem => Object.assign({}, dataItem, { key: dataItem.id }));
        this.setState({ data: mappedData });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  setModalVisible(visible, {id}) {
    this.refs.modal.setModalVisible(visible, {id});
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.fetchData().then(() => {
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
        <ModalDialog ref="modal" reload={this.fetchData}/>
        <FlatList
          ListEmptyComponent={
            <Text style={styles.emptyList}>Sorry. No tasks available to work on.</Text>
          }
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}
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

        <DateTimePicker
          isVisible = { this.state.dateTime.pickerActive }
          titleIOS = { this.state.dateTime.pickerTitle }
          date = { this.state.dateTime.currentDate }
          onCancel = { () => {
            this.state.dateTime.pickerActive = false;
            this.setState(this.state);
          }}
          onConfirm={(date) => {
            date = date.toISOString().slice(0, -1) + '+0000';
            let item = this.state.dateTime.item;
            item[this.state.dateTime.type] = date;
            this._putTaskUpdate(item)
              .then(() => {
                this.updateData(item, this.state.dateTime.type, date);
                this.state.dateTime.pickerActive = false;
                this.setState(this.state);
              })
          }}/>
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
