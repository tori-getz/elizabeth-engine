
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, TextBox, AppBarButton, Separator, Menu, MenuItem } from "react-uwp";
import { connect } from "react-redux";
import _ from "lodash";

const style = {
    wrapper: {
        width: "400px",
        position: "absolute"
    },
    textbox: {
        marginTop: 10,
        marginBottom: 10,
        width: "100%"
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
            backgroundColor: "712fbb"
        };
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
                            />
                        ]}
                        secondaryCommands={secondaryCommands}
                    />

                    <div style={{
                        width: "100%",
                        height: 60,
                        backgroundColor: "#" + this.state.backgroundColor,
                        marginTop: 15,
                        marginBottom: 15
                    }}>
                        <center>
                            <br />
                            <p> <b>Background color</b> </p>
                        </center>
                    </div>

                    <TextBox
                        style={style.textbox}
                        placeholder="HEX color"
                        defaultValue={this.state.backgroundColor}
                        onChangeValue={this.changeProjectPath}
                    />

                    <TextBox
                        style={{...style.textbox, marginBottom: 25}}
                        placeholder="Joy handler"
                        onChangeValue={this.changeProjectPath}
                    />

                    <Separator />

                    <div style={{
                        marginTop: 25
                    }}>
                        <Menu menuItemHeight={36} expandedMethod="hover" style={{ width: "100%", marginTop: 20 }}>
                            <MenuItem label="Scene1" >
                                <MenuItem
                                    label="Rename"
                                    icon="Edit"
                                />
                                <MenuItem
                                    label="Remove"
                                    icon="Remove"
                                />
                            </MenuItem>
                            <MenuItem label="Scene2" >
                                <MenuItem
                                    label="Rename"
                                    icon="Edit"
                                />
                                <MenuItem
                                    label="Remove"
                                    icon="Remove"
                                />
                            </MenuItem>
                            <MenuItem label="Scene3" >
                                <MenuItem
                                    label="Rename"
                                    icon="Edit"
                                />
                                <MenuItem
                                    label="Remove"
                                    icon="Remove"
                                />
                            </MenuItem>
                        </Menu>
                    </div>
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
        closeSprites: () => dispatch({ type: "CLOSE_WINDOW", payload: "scenes" }),
        saveProjectInStore: (project, workdir) => dispatch({ type: "SAVE_PROJECT", payload: { project: project, workdir: workdir } }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
