import React from 'react';
import moment from 'moment';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';


export default class TaskItem extends React.Component {

  constructor(props) {
    super(props);
  }


  _formatDate(value) {
    return value ? moment(value).fromNow() : ''
  }

  render() {
    let taskName = this.props.name !== null ? this.props.name.replace(/\r?\n|\r/g, ' ') : this.props.id;
    let assignee = this.props.assignee;

    return (

      <TouchableHighlight
          style={styles.touch}
          onPress={()=> this.props.shouldOpen && this.props.openModal(true, {id: this.props.id})} underlayColor="rgba(0, 0, 0, 0.05)">
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>{taskName}</Text>
            <Text style={styles.assignee}>{assignee}</Text>
          </View>
          <Text style={styles.date}>{this._formatDate(this.props.due)}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    flex: 1,
    padding: 15,
    paddingLeft:0,
    paddingRight:0
  },
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  assignee:{
    paddingTop: 7,
    fontSize: 12
  },
  bodyText: {
    fontSize: 10
  },
  date: {
    fontSize: 10,
    color: 'gray'
  }
});
