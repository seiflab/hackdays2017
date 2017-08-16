import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';


export default class TaskList extends React.Component {

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => <Text style={styles.item} key={item.id}>{item.name}</Text>

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
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
    padding: 100,
    flex: 1
  }
});
