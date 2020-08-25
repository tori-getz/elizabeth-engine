
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

        this.setEditScene = this.setEditScene.bind(this);
        this.addScene = this.addScene.bind(this);
        this.removeScene = this.removeScene.bind(this);
    }

    componentWillMount () {
        window.ipcRenderer.on("scene_added", (event, message) => {
            console.log(message);

            let newScenes = [...this.props.project.scenes];
            
            newScenes.push(message);

            this.saveProject(newScenes);
        });

        window.ipcRenderer.on("scene_edited", (event, message) => {
            console.log(message);

            let newScenes = [];

            for (let scene of this.props.project.scenes) {
                if (scene.id === message.id) {
                    newScenes.push(message);
                } else {
                    newScenes.push(scene);
                }
            }

            this.saveProject(newScenes);
        });
    }

    addScene () {
        window.ipcRenderer.send("add_scene");
    }

    editScene (scene) {
        window.ipcRenderer.send("edit_scene", scene);
    }

    setEditScene (id, name) {
        let editScene = {
            id: id,
            name: name
        };

        this.props.setEditScene(editScene);
    }

    removeScene (idForRemove) {
        let newScenes = [];

        for (let scene of this.props.project.scenes) {
            if (scene.id !== idForRemove) {
                newScenes.push(scene);
            }
        }

        this.saveProject(newScenes);
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
                                            <MenuItem
                                                label={scene.name}
                                                onClick={() => this.setEditScene(scene.id, scene.name)}    
                                            >
                                                <MenuItem
                                                    label="Edit"
                                                    icon="Edit"
                                                    onClick={() => this.editScene(scene)}
                                                />
                                                <MenuItem
                                                    label="Remove"
                                                    icon="Remove"
                                                    onClick={() => this.removeScene(scene.id)}
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
        saveProjectInStore: (project, workdir) => dispatch({ type: "SAVE_PROJECT", payload: { project: project, workdir: workdir } }),
        setEditScene: (editScene) => dispatch({ type: "SET_EDIT_SCENE", payload: { editScene: editScene } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
