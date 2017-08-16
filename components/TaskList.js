import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';


export default class TaskList extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          renderItem={({item}) => <Text style={styles.item} key={item.id}>{item.name}</Text>}
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
