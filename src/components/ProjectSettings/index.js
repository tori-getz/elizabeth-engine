
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, DropDownMenu, Button, TextBox, AppBarButton } from "react-uwp";
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

class Variable extends Component {
    constructor () {
        super();

        this.state = {
            id: "",
            type: "",
            key: "",
            value: ""
        };
        
        this.recieveData = this.recieveData.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeKey = this.onChangeKey.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillMount () {
        this.setState({
            id: this.props.id,
            type: this.props.type,
            key: this.props.key,
            value: this.props.value
        });
    }

    onChangeType (type) {
        this.setState({ type: type });

        this.recieveData();
    }

    onChangeKey (key) {
        this.setState({ key: key });

        this.recieveData();
    }

    onChangeValue (value) {
        this.setState({ value: value });

        this.recieveData();
    }

    recieveData () {
        this.props.onChangeData(this.state);
    }

    render () {
        return (
            <div style={style.textbox}> 
                <DropDownMenu
                    values={[ "string", "int", "bool" ]}
                    style={{ width: "100%" }}
                    defaultValue={this.state.type}
                    onChangeValue={this.onChangeType}
                />
                <TextBox
                    style={{ width: "100%", marginTop: 10 }}
                    placeholder="Key"
                    defaultValue={this.state.key}
                    onChangeValue={this.onChangeKey}
                />
                { this.state.type === "bool"
                    ? 
                    <DropDownMenu
                        values={[ "true", "false" ]}
                        style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
                        defaultValue={this.state.value}
                        onChangeValue={this.onChangeValue}
                    />            
                    :
                    <TextBox
                        style={{ width: "100%", marginTop: 10 }}
                        placeholder="Value"
                        defaultValue={this.state.value}
                        onChangeValue={this.onChangeValue}
                    />
                }

                <Button style={{ width: "100%", marginTop: 10 }} onClick={() => this.props.onDelete(this.state.id)}> Delete </Button>
            </div>
        );
    }
}

class ProjectSettings extends Component {
    constructor () {
        super();

        this.state = {
            projectName: "",
            emulatorPath: "",
            mainScene: "",
            variables: []
        };

        this.renderVariables = this.renderVariables.bind(this);
        this.addVariable = this.addVariable.bind(this);
        this.deleteVariable = this.deleteVariable.bind(this);
        this.changeVariable = this.changeVariable.bind(this);
        this.saveProjectFile = this.saveProjectFile.bind(this);
    }

    componentWillMount () {
        this.setState({
            projectName: this.props.project.name,
            emulatorPath: this.props.project.emulator,
            mainScene: this.props.project.mainScene,
            variables: this.props.project.variables,
            disabledSaveButton: true
        });
    }

    addVariable () {
        let newVariables = !_.isEmpty(this.state.variables) ? [...this.state.variables] : [];
        newVariables.push({
            id: Uniqid(),
            type: "string",
            key: "",
            value: ""
        });
        this.setState({
            variables: newVariables,
            disabledSaveButton: false
        });

        console.log(newVariables);
    }

    deleteVariable (id) {
        this.setState({
            variables: this.state.variables.filter((e) => e.id != id),
            disabledSaveButton: false
        });
    }

    changeVariable (variable) {
        this.setState({
            variables: this.state.variables.map((v, i) => v.id === variable.id ? variable : v),
            disabledSaveButton: false
        });
    }

    saveProjectFile () {
        console.log("Save project file...");

        let newProject = {...this.props.project};

        newProject.name = this.state.projectName;
        newProject.emulator = this.state.emulatorPath;
        newProject.mainScene = this.state.mainScene;

        let newVariables = [];

        if (!_.isEmpty(this.state.variables)) {
            for (let variable of this.state.variables) {
                let newVariable = {};
    
                newVariable.type = variable.type;
                newVariable.key = variable.key;
                
                if (variable.type === "string") {
                    newVariable.value = variable.value;
                }
    
                if (variable.type === "int") {
                    newVariable.value = parseInt(variable.value);
                }
    
                if (variable.type === "bool") {
                    newVariable.value = variable.value === "true";
                }
    
                newVariables.push(newVariable);
            }
        }

        newProject.variables = newVariables;

        console.log(newProject);

        window.ipcRenderer.send("save_project", newProject);

        this.setState({ disabledSaveButton: true });

        this.props.saveProjectInStore(newProject, this.props.workdir);
    }

    renderVariables () {
        const _this = this;
        if (!_.isEmpty(this.state.variables)) {
            return this.state.variables.map((variable, index) => {
                return <Variable
                    key={index}
                    id={variable.id}
                    type={variable.type}
                    name={variable.key}
                    data={variable.value}
                    onDelete={_this.deleteVariable}
                    onChangeData={_this.changeVariable}
                />
            });
        } else {
            return <p style={style.text}> Empty </p>
        }
    }

    render () {
        console.log("PROJECT SETTINGS STATE - ");
        console.log(this.state);

        let secondaryCommands = [ <p onClick={() => { this.props.closeProjectSettings() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Project Settings"
                        primaryCommands={[
                            !this.state.disabledSaveButton ? <AppBarButton
                                icon="Save"
                                label="Save"
                                onClick={this.saveProjectFile}
                            /> : ""
                        ]}
                        secondaryCommands={secondaryCommands}
                    />

                    <TextBox
                        style={style.textbox}
                        placeholder="Project name"
                        defaultValue={this.state.projectName}
                        onChangeValue={(value) => {
                            this.setState({
                                projectName: value,
                                disabledSaveButton: false
                            })
                        }}
                    />

                    <TextBox
                        style={style.textbox}
                        placeholder="Emulator path"
                        defaultValue={this.state.emulatorPath}
                        onChangeValue={(value) => {
                            this.setState({
                                emulatorPath: value,
                                disabledSaveButton: false
                            })
                        }}
                    />

                    <TextBox
                        style={style.textbox}
                        placeholder="Main scene"
                        defaultValue={this.state.mainScene}
                        onChangeValue={(value) => {
                            this.setState({
                                mainScene: value,
                                disabledSaveButton: false
                            })
                        }}
                    />

                    <p style={style.text}> <b>Global Variables</b> </p>

                    {this.renderVariables()}

                    <Button
                        style={{ marginTop: 20 }}
                        onClick={this.addVariable}
                    >
                        Add
                    </Button>

                </div>
            </Draggable>
        );
    };
}

function mapStateToProps (state) {
    return state;
}

function mapDispatchToProps (dispatch) {
    return {
        closeProjectSettings: () => dispatch({ type: "CLOSE_WINDOW", payload: "projectSettings" }),
        saveProjectInStore: (project, workdir) => dispatch({ type: "SAVE_PROJECT", payload: { project: project, workdir: workdir } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);
