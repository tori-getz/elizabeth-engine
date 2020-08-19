
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar } from "react-uwp";
import { connect } from "react-redux";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-twilight"

const style = {
    wrapper: {
        width: "800px",
        position: "absolute"
    },
    log: {
        marginTop: 10,
        width: "100%"
    }
}

class CodeEditor extends Component {
    constructor () {
        super();

        this.state = {
            file: "",
            data: ""
        }

        this.saveCode = this.saveCode.bind(this);
    }

    componentWillMount () {
        console.log(`Open file ${this.props.file}...`);
        
        window.ipcRenderer.on(`${this.props.file}_opened`, (event, message) => {
            this.setState({
                file: this.props.file,
                data: message
            });
        });

        window.ipcRenderer.send("open_code", this.props.file);
    }

    saveCode (data) {
        window.ipcRenderer.send("save_code", { name: this.state.file, data: data });
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeEditor(this.state.file) }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content={this.state.file}
                        secondaryCommands={secondaryCommands}
                    />
                    <AceEditor
                        mode="csharp"
                        theme="twilight"
                        width="100%"
                        value={this.state.data}
                        onChange={this.saveCode}
                    />
                </div>
            </Draggable>
        );
    };
}

function mapStateToProps (state) {
    return state.settings;
}

function mapDispatchToProps (dispatch) {
    return {
        closeEditor: (fileName) => dispatch({ type: "CLOSE_EDIT", payload: fileName }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
