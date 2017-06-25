'use babel';

import EditOscView from './edit-osc-view';
import { CompositeDisposable } from 'atom';

var osc = require('node-osc');

export default {

  editOscView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    var client = new osc.Client('127.0.0.1', 12000);
    this.editOscView = new EditOscView(state.editOscViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.editOscView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'edit-osc:start': () => this.start()
    }));
    atom.workspace.observeTextEditors(function(editor) {
      editor.onDidChange(function(){
        const editor = atom.workspace.getActiveTextEditor()
        client.send("/atom/text", editor.getText());
      })
    });
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.editOscView.destroy();
  },

  serialize() {
    return {
      editOscViewState: this.editOscView.serialize()
    };
  },

  start() {
    console.log('EditOsc was started!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.hide()
    );
  }

};
