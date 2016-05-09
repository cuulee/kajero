import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import { updateBlock, deleteBlock, moveBlockUp, moveBlockDown } from '../actions';

export default class Block extends Component {

    constructor(props) {
        super(props);
        this.state = {editing: false};
        this.enterEdit = this.enterEdit.bind(this);
        this.exitEdit = this.exitEdit.bind(this);
        this.textChanged = this.textChanged.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.deleteBlock = this.deleteBlock.bind(this);
        this.moveBlockUp = this.moveBlockUp.bind(this);
        this.moveBlockDown = this.moveBlockDown.bind(this);
    }

    enterEdit() {
        if (this.props.editable) {
            this.setState({
                editing: true,
                text: this.props.block.get('content')
            });
        }
    }

    exitEdit(focusOn) {
        if (!focusOn) {
            this.setState({editing: false});
            this.props.dispatch(
                updateBlock(this.props.block.get('id'), this.state.text)
            );
        }
    }

    textChanged(text) {
        this.setState({text});
        console.log(this.state);
    }

    componentDidUpdate() {
        if (this.refs.editarea) {
            this.refs.editarea.focus();
        }
    }

    deleteBlock() {
        this.props.dispatch(deleteBlock(this.props.block.get('id')));
    }

    moveBlockUp() {
        this.props.dispatch(moveBlockUp(this.props.block.get('id')));
    }

    moveBlockDown() {
        this.props.dispatch(moveBlockDown(this.props.block.get('id')));
    }

    getButtons() {
        if (!this.props.editable) {
            return null;
        }
        let buttons = [];
        if (!this.props.isLast) {
            buttons.push(
                <i className="fa fa-arrow-circle-o-down" key="down"
                    onClick={this.moveBlockDown} title="Move block down">
                </i>
            );
        }
        if (!this.props.isFirst) {
            buttons.push(
                <i className="fa fa-arrow-circle-o-up" key="up"
                    onClick={this.moveBlockUp} title="Move block up">
                </i>
            );
        }
        buttons.push(
            <i className="fa fa-times-circle-o" key="delete"
                onClick={this.deleteBlock} title="Remove block">
            </i>)
        ;
        return buttons;
    }

    render() {
        const { block, editable } = this.props;
        if (!editable || !this.state.editing) {
            return this.renderViewerMode();
        }
        const spellcheck = (block.get('type') !== 'code');
        const options = {
            mode: block.get('type') === 'code' ? 'javascript' : 'markdown',
            theme: 'base16-tomorrow-light',
            lineNumbers: true,
            indentUnit: 4,
            extraKeys: {
                Tab: (cm) => {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            }
        };
        return (
            <Codemirror value={this.state.text} options={options}
                onFocusChange={this.exitEdit} onChange={this.textChanged}
                ref="editarea" />
        );
    }

}
