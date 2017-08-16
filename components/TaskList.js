import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';


export default class TaskList extends React.Component {

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => <Text style={styles.item} key={item.id}>{item.name}</Text>

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
    padding: 10,
    flex: 1
  }
});
