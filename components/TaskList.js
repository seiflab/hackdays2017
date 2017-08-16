import Swipeable from 'react-native-swipeable';
import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import TaskItem from './TaskItem';



export default class TaskList extends React.Component {

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => {
    const leftContent = <Text>Pull to activate</Text>;
    const rightButtons = [
      <Text style={styles.btn}>Button 1</Text>,
      <Text>Button 2</Text>
    ];
    return (
    <Swipeable style={styles.item} leftContent={leftContent} rightButtons={rightButtons}>
      <TaskItem {...item} />
    </Swipeable>
  );
}

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      data: []
    };
  }

  _fetchData() {
    return fetch('http://localhost:8080/engine-rest/task')
      .then(response => response.json())
      .then((data) => {
        const mappedData = data.map(dataItem => Object.assign({}, dataItem, { key: dataItem.id }));
        this.setState({ data: mappedData });
      });
  }

  componentDidMount() {
    this._fetchData();
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this._fetchData().then(() => {
      this.setState({isRefreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          data={this.state.data}
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
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    padding: 15
  },
  btn: {
    backgroundColor: 'red'
  }
});
