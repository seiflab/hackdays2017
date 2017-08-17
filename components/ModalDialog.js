import React from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, View, WebView } from 'react-native';
import { parseForm, getFormInputNames, getInjectedForm } from '../utils';

export default class ModalDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      webViewStyle: '<style>body{ font-family: -apple-system, BlinkMacSystemFont, sans-serif;}.control-group{display:flex; flex-direction:column; align-items: space-between} input{width: 100%} select{width: 100%;} label{font-weight: bold;}</style>',
      formHtml: ''
    };
  }

  setModalVisible(visible, {id}) {
    if(!id){
      return this.setState({modalVisible: visible});
    }
    return fetch(`http://localhost:8082/engine-rest/task/${id}/form`)
      .then(({_bodyText}) => {
        const resultJson = JSON.parse(_bodyText);
        const key = parseForm(resultJson);
        return fetch(`http://localhost:8082/${key}`);
      })
      .then(({_bodyText}) => {
        this.setState({
          formHtml: `<div>${_bodyText}</div>`
        });
        const varNames = getFormInputNames(_bodyText);
        return fetch(`http://localhost:8082/engine-rest/task/${id}/form-variables?deserializeValues=false&${varNames}`);
      })
      .then(({_bodyText}) => {
        const injectedForm = getInjectedForm(this.state.formHtml, JSON.parse(_bodyText));
        this.setState({
          formHtml: `<div>${injectedForm}</div>${this.state.webViewStyle}`,
          modalVisible: true
        });
      })
      .catch(console.log)
  }

  componentDidMount(){
    const styleTag = '<style>body{ font-family: -apple-system, BlinkMacSystemFont, sans-serif;}.control-group{display:flex; flex-direction:column; align-items: space-between} input{width: 100%} select{width: 100%;} label{font-weight: bold;}</style>';

  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}>
        <View style={styles.container}>
            <WebView
              source={{html: this.state.formHtml}}
              style={styles.webview}
            />
            <TouchableHighlight
              onPress={() => this.setModalVisible(!this.state.modalVisible, {})}
              style={styles.hide}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  webview: {
    flex: 1,
    marginTop: 20
  },
  hide: {
    height: 30
  }
});
