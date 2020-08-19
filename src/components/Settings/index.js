
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, DropDownMenu, CheckBox, Button } from "react-uwp";
import { connect } from "react-redux";

const style = {
    wrapper: {
        width: "400px",
        position: "absolute"
    },
    text: {
        margin: 10
    },
    checkbox: {
        marginTop: 15,
        marginLeft: 10
    }
}

class Settings extends Component {
    constructor () {
        super();

        this.state = {
            theme: ""
        }

        this.changeTheme = this.changeTheme.bind(this);
    }

    changeTheme (theme) {
        this.setState({ theme: theme });
    }

    componentWillMount () {
        this.setState({ theme: this.props.theme });
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeSettings() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Settings"
                        secondaryCommands={secondaryCommands}
                    >
                    </CommandBar>
                    <p style={style.text}> Theme: </p>
                    <DropDownMenu
                        values={[ "dark", "light" ]}
                        onChangeValue={this.changeTheme}
                        defaultValue={this.props.theme}
                        enableFullWidth
                    />
                    <div>
                        <Button style={style.checkbox} onClick={() => this.props.editSettings({ theme: this.state.theme })}> Apply </Button>
                    </div>
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
        closeSettings: () => dispatch({ type: "CLOSE_WINDOW", payload: "settings" }),
        editSettings: (settings) => dispatch({ type: "EDIT_SETTINGS", payload: settings })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
