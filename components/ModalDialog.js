import React from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';

export default class ModalDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View style={{marginTop: 22}}>
          <View>
            <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
        </View>
      </Modal>
    );
  }
}