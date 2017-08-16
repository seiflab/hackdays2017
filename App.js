import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TaskList from './components/TaskList';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch('http://localhost:8080/engine-rest/task')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {
    return (
      <View style={styles.container}>
        <TaskList data={this.state.data} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
});
