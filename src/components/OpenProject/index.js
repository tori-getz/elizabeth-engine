
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, Button, TextBox } from "react-uwp";
import { connect } from "react-redux";

console.log(window.ipcRenderer);

const style = {
    wrapper: {
        width: "400px",
        position: "absolute"
    },
    textbox: {
        marginTop: 10,
        width: "100%"
    }
}

class OpenProject extends Component {
    constructor () {
        super();

        this.state = {
            projectPath: ""
        }

        this.changeProjectPath = this.changeProjectPath.bind(this);
        this.getProjectFile = this.getProjectFile.bind(this);
    }

    changeProjectPath (stroke) {
        this.setState({ projectPath: stroke });
    }

    getProjectFile () {
        window.ipcRenderer.on("load_project", (event, message) => {
            if (message.type === "notfound") {
                alert("Project not found!");
            }

            if (message.type === "error") {
                alert("Error!\n\n" + message.payload);
            }

            if (message.type === "found") {
                console.log("Load project...");

                this.props.loadProject(message.payload, this.state.projectPath);
            }
        });

        window.ipcRenderer.send("open_project", this.state.projectPath);
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeOpenProject() }}> Close </p> ];

        console.log(`Settings - ${JSON.stringify(this.state)}`);

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Open project"
                        secondaryCommands={secondaryCommands}
                    />

                    <TextBox
                        style={style.textbox}
                        placeholder="Path to Elizabeth project"
                        onChangeValue={this.changeProjectPath}
                    />

                    <Button
                        style={{ marginTop: 10 }}
                        onClick={this.getProjectFile}
                    > 
                        Open
                    </Button>
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
        closeOpenProject: () => dispatch({ type: "CLOSE_WINDOW", payload: "openProject" }),
        editSettings: (settings) => dispatch({ type: "EDIT_SETTINGS", payload: settings }),
        loadProject: (project, workdir) => dispatch({ type: "LOAD_PROJECT", payload: { project: project, workdir: workdir } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenProject);
