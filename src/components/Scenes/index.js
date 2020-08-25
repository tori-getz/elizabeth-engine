
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, ListView, AppBarButton, Menu, MenuItem } from "react-uwp";
import { connect } from "react-redux";
import _ from "lodash";

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

class Scenes extends Component {
    constructor () {
        super();

        this.state = {
            scenes: []
        }
    }

    componentWillMount () {
        window.ipcRenderer.on("scene_added", (event, message) => {
            console.log(message);

            let newScenes = [...this.props.project.scenes];
            newScenes.push(message);
            
            let editScene = {
                name: message.name,
                id: message.id
            };

            this.saveProject(newScenes);
        });
    }

    addScene () {
        window.ipcRenderer.send("add_scene");
    }

    saveProject (newScenes) {
        let newProject = {...this.props.project};

        newProject.scenes = newScenes;

        this.props.saveProjectInStore(newProject, this.props.workdir);
        
        window.ipcRenderer.send("save_project", newProject);
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeScenes() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Scenes"
                        primaryCommands={[
                            <AppBarButton
                                icon="Add"
                                label="New"
                                onClick={this.addScene}
                            />
                        ]}
                        secondaryCommands={secondaryCommands}
                    />

                    <Menu menuItemHeight={36} expandedMethod="hover" style={{ width: "100%", marginTop: 20 }}>
                        {
                            !_.isEmpty(this.props.project.scenes)
                                ?
                                    this.props.project.scenes.map((scene, index) => {
                                        return (
                                            <MenuItem label={scene.name}>
                                                <MenuItem
                                                    label="Edit"
                                                    icon="Edit"
                                                />
                                                <MenuItem
                                                    label="Remove"
                                                    icon="Remove"
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
        closeScenes: () => dispatch({ type: "CLOSE_WINDOW", payload: "scenes" }),
        saveProjectInStore: (project, workdir) => dispatch({ type: "SAVE_PROJECT", payload: { project: project, workdir: workdir } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
