
import React from "react"
import Draggable from "react-draggable";
import { CommandBar, AppBarButton, Menu, MenuItem } from "react-uwp";
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

class Sprites extends React.Component {
    constructor () {
        super();

        this.state = {
            code: []
        }

        this.saveProject = this.saveProject.bind(this);
        this.addSprite = this.addSprite.bind(this);
        this.editSprite = this.editSprite.bind(this);
    }

    componentWillMount () {
        window.ipcRenderer.on("added_sprite", (event, sprite) => {
            let newSprites = !_.isEmpty(this.state.sprites) ? [...this.state.sprites] : [];

            newSprites.push(sprite);

            this.setState({
                sprites: newSprites
            });

            this.saveProject(newSprites);

            this.forceUpdate();
        });

        window.ipcRenderer.on("updated_sprite", (event, editedSprite) => {
            console.log(editedSprite);
            let newSprites = [];

            for (let sprite of this.state.sprites) {
                if (sprite.id === editedSprite.id) {
                    newSprites.push(editedSprite);
                } else {
                    newSprites.push(sprite);
                }
            }

            this.setState({
                sprites: newSprites
            });

            this.saveProject(newSprites);
        });

        this.setState({
            sprites: this.props.project.resources.sprites
        });
    }
    
    addSprite () {
        window.ipcRenderer.send("add_sprite");
    }

    editSprite (resource) {
        window.ipcRenderer.send("edit_sprite", resource);
    }

    removeSprite (id) {
        let newSprites = [];

        for (let sprite of this.state.sprites) {
            if (sprite.id !== id) {
                newSprites.push(sprite);
            }
        }

        this.setState({
            sprites: newSprites
        });

        this.saveProject(newSprites);
    }

    saveProject (newSprites) {
        let newProject = {...this.props.project};

        newProject.resources.sprites = newSprites;

        this.props.saveProjectInStore(newProject, this.props.workdir);
        
        window.ipcRenderer.send("save_project", newProject);
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeSprites() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Sprites"
                        primaryCommands={[
                            <AppBarButton
                                icon="Add"
                                label="New"
                                onClick={this.addSprite}
                            />
                        ]}
                        secondaryCommands={secondaryCommands}
                    />

                    <Menu menuItemHeight={36} expandedMethod="hover" style={{ width: "100%", marginTop: 20 }}>
                        {!_.isEmpty(this.state.sprites)
                        ?
                            this.state.sprites.map((spriteResource, index) => {
                                console.log(spriteResource);

                                return (
                                    <MenuItem label={`${spriteResource.name}`}>
                                        <MenuItem
                                            label="Edit"
                                            icon="Edit"
                                            onClick={() => this.editSprite(spriteResource)}
                                        />
                                        <MenuItem
                                            label="Remove"
                                            icon="Remove"
                                            onClick={() => this.removeSprite(spriteResource.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Sprites);
