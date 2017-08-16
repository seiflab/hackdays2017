import React from 'react';
import moment from 'moment';
import { View, StyleSheet, Text } from 'react-native';


export default class TaskItem extends React.Component {

  constructor(props) {
    super(props);
    console.log('item props: ', props);
  }


  _formatDate(value) {
    return moment(value).fromNow();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}> {this.props.name.replace(/\r?\n|\r/g, ' ')} </Text>
        <Text style={styles.date}>{this._formatDate(this.props.created)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  bodyText: {
    fontSize: 10
  },
  date: {
    fontSize: 10,
    color: 'gray'
  }
});
