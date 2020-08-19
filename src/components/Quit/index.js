
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar, DropDownMenu, CheckBox, Button, TextBox } from "react-uwp";
import { connect } from "react-redux";

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

class Quit extends Component {
    constructor () {
        super();

        this.state = {
            theme: ""
        }
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeQuit() }}> Close </p> ];

        console.log(`Settings - ${JSON.stringify(this.state)}`);

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Quit?"
                        secondaryCommands={secondaryCommands}
                    />

                    <Button
                        style={{ marginTop: 10, marginRight: 10 }}
                        onClick={() => window.close()}
                    > 
                        Yes
                    </Button>

                    <Button
                        style={{ marginTop: 10 }}
                        onClick={this.props.closeQuit}
                    > 
                        No
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
        closeQuit: () => dispatch({ type: "CLOSE_WINDOW", payload: "quit" })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quit);
