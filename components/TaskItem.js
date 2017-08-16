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
        <View style={styles.body}>
          <Text style={styles.date}>{this._formatDate(this.props.created)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column'
  },
  header: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold'
  },
  body: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  bodyText: {
    fontSize: 10
  },
  date: {
    fontSize: 10,
    color: 'gray'
  }
});
