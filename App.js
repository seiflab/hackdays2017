import React from 'react';
import { StyleSheet, Text, View, NavigatorIOS, StatusBar } from 'react-native';
import TaskList from './components/TaskList';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <NavigatorIOS
          style={styles.navigator}
          barTintColor= '#b5152b'
          titleTextColor='white'
          initialRoute={{
            component: TaskList,
            title: 'Tasklist',
            tintColor: 'white'
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex:1
  },
  container: {
    flex: 1
  },
});
