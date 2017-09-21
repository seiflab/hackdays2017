import React from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, View, WebView } from 'react-native';
import { parseForm, getFormInputNames, getInjectedForm, getFormData, addSubmitToForm } from '../utils';
import {ENGINE_URL} from '../config';

const script = 'const form = document.querySelector("form"); form.onsubmit = (e) => {e.preventDefault();var checkbox = document.querySelector("input[type=checkbox]"); checkbox && checkbox.setAttribute("checked", checkbox.checked);var select=document.querySelector("select"); select && select.setAttribute("value", select.value); window.postMessage(e.target.outerHTML);};';
export default class ModalDialog extends React.Component {
  constructor() {
    super();
    this._onMessage = this._onMessage.bind(this);
    this.state = {
      modalVisible: false,
      webViewStyle: '<style>body{ font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size:13px}.form-group{display:flex; flex-direction:column; align-items: space-between; margin-bottom: 20px} input{width: 100%; font-size: 13px} select{width: 100%;} label{font-weight: bold; font-size:14px} input[type=submit]{-webkit-appearance: none; padding: 5px; background: #428bca; color: white; font-weight: bold;} input[type=checkbox]{width: auto;}',
      formHtml: '',
      taskId: ''
    };
  }

  setModalVisible(visible, {id}) {
    if(!id){
      return this.setState({modalVisible: visible});
    }
    this.setState({taskId: id});
    return fetch(`${ENGINE_URL}/engine-rest/task/${id}/form`)
      .then(({_bodyText}) => {
        const resultJson = JSON.parse(_bodyText);
        const key = parseForm(resultJson);
        return fetch(`${ENGINE_URL}/${key}`);
      })
      .then(({_bodyText}) => {
        this.setState({
          formHtml: `<div>${_bodyText}</div>`
        });
        const varNames = getFormInputNames(_bodyText);
        return fetch(`${ENGINE_URL}/engine-rest/task/${id}/form-variables?deserializeValues=false&${varNames}`);
      })
      .then(({_bodyText}) => {
        const injectedForm = getInjectedForm(this.state.formHtml, JSON.parse(_bodyText));
        const submitForm = addSubmitToForm('<div>'+injectedForm+'</div>');
        console.log(submitForm);
        this.setState({
          formHtml: `<div>${submitForm}</div>${this.state.webViewStyle}`,
          modalVisible: true
        });
      })
      .catch(console.log)
  }

  _onMessage(event){
    const varsToSubmit =  JSON.stringify(getFormData(event.nativeEvent.data));
    return fetch(`${ENGINE_URL}/engine-rest/task/${this.state.taskId}/submit-form`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: varsToSubmit
    })
      .then(() => {
        this.props.reload();
        this.setModalVisible(!this.state.modalVisible, {});
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
              onMessage={this._onMessage}
              injectedJavaScript={script}
            />
            <TouchableHighlight
              onPress={() => this.setModalVisible(!this.state.modalVisible, {})}
              style={styles.hide}>
              <Text style={styles.hideText}>Cancel</Text>
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
    marginTop: 10
  },
  hide: {
    height: 30,
    backgroundColor: '#b5152b',
    paddingTop: 5
  },
  hideText: {
    flex:1,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
});
