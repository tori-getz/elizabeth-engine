
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, ListView, AppBarButton, Menu, MenuItem } from "react-uwp";
import { connect } from "react-redux";
import _ from "lodash";
import Uniqid from "uniqid";

const style = {
    wrapper: {
        width: "400px",
        position: "absolute"
    },
    textbox: {
        marginTop: 10,
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        width: "100%"
    }
}

class Code extends Component {
    constructor () {
        super();

        this.state = {
            code: []
        }

        this.removeCodeFile = this.removeCodeFile.bind(this);
        this.saveProject = this.saveProject.bind(this);
        this.addCode = this.addCode.bind(this);
        this.editCode = this.editCode.bind(this);
    }

    componentWillMount () {
        window.ipcRenderer.on("added_code", (event, code) => {
            let newCode = [...this.state.code];

            newCode.push(code);

            this.setState({
                code: newCode
            });

            this.saveProject(newCode);
        });

        window.ipcRenderer.on("updated", (event, editedCode) => {
            console.log(editedCode);
            let newCode = [];

            for (let code of this.state.code) {
                if (code.id === editedCode.id) {
                    newCode.push(editedCode);
                } else {
                    newCode.push(code);
                }
            }

            this.setState({
                code: newCode
            });

            this.saveProject(newCode);
        });

        this.setState({
            code: this.props.project.resources.code
        });
    }
    
    addCode () {
        window.ipcRenderer.send("add_code");
    }

    editCode (resource) {
        window.ipcRenderer.send("edit_code", resource);
    }

    removeCodeFile (id) {
        console.log(`Remove ${id}`);
        let newCode = [];

        for (let codeResource of this.state.code) {
            if (codeResource.id !== id) {
                newCode.push(codeResource);
            } else {
                window.ipcRenderer.send("delete_code", codeResource.path);
            }
        }

        this.setState({
            code: newCode
        });

        this.saveProject(newCode);
    }

    saveProject (newCode) {
        let newProject = {...this.props.project};

        newProject.resources.code = newCode;

        this.props.saveProjectInStore(newProject, this.props.workdir);
        
        window.ipcRenderer.send("save_project", newProject);
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeSprites() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Code"
                        primaryCommands={[
                            <AppBarButton
                                icon="Add"
                                label="New"
                                onClick={this.addCode}
                            />
                        ]}
                        secondaryCommands={secondaryCommands}
                    />

                    <Menu menuItemHeight={36} expandedMethod="hover" style={{ width: "100%", marginTop: 20 }}>
                        {!_.isEmpty(this.state.code)
                        ?
                            this.state.code.map((codeResource, index) => {
                                console.log(codeResource);

                                return (
                                    <MenuItem label={`${codeResource.name} ${codeResource.type === "joyhandler" ? "(Joy Handler)" : ""}`}>
                                        <MenuItem
                                            label="Edit"
                                            icon="Code"
                                            onClick={() => this.props.openCodeFile(codeResource.path)}
                                        />
                                        <MenuItem
                                            label="Rename"
                                            icon="Edit"
                                            onClick={() => this.editCode(codeResource)}
                                        />
                                        <MenuItem
                                            label="Remove"
                                            icon="Remove"
                                            onClick={() => this.removeCodeFile(codeResource.id)}
                                        />
                                    </MenuItem>
                                );
                            })
                        :
                            ""
                        }
                    </Menu>
                </div>
            </Draggable>
        );
    }
}

function mapStateToProps (state) {
    return state;
}

function mapDispatchToProps (dispatch) {
    return {
        closeSprites: () => dispatch({ type: "CLOSE_WINDOW", payload: "sprites" }),
        saveProjectInStore: (project, workdir) => dispatch({ type: "SAVE_PROJECT", payload: { project: project, workdir: workdir } }),
        openCodeFile: (file) => dispatch({ type: "OPEN_EDIT", payload: file })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
