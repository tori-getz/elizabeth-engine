
import React, { Component } from "react";
import { Button } from "react-uwp";
import { connect } from "react-redux";

import Settings from "../../components/Settings"
import OpenProject from "../../components/OpenProject";
import Quit from "../../components/Quit";

const styles = {
    button: {
        marginRight: "10px",
        marginTop: "10px"
    },
    buttonsBlock: {
        marginTop: "40px"
    },
    mainBlock: {
        marginTop: "15%"
    }
};

class StartScreen extends Component {
    constructor () {
        super();

        this.state = {
            
        }
    }

    render () {
        console.log("render...");

        return (
            <div>
                {this.props.opened.settings ? <Settings /> : ""}
                {this.props.opened.openProject ? <OpenProject /> : ""}
                {this.props.opened.quit ? <Quit /> : ""}

                <center>
                    <h1 style={styles.mainBlock}> Elizabeth Engine </h1>

                    <div style={styles.buttonsBlock}>
                        <Button style={styles.button}> New project </Button>
                        <Button style={styles.button} onClick={this.props.openProject}> Open project </Button>
                        <Button style={styles.button} onClick={this.props.openSettings}> Settings </Button>
                        <Button style={styles.button} onClick={this.props.openQuit}> Quit </Button>
                    </div>
                </center>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return state;
}

function mapDispatchToProps (dispatch) {
    return {
        openSettings: () => dispatch({ type: "OPEN_WINDOW", payload: "settings" }),
        openProject: () => dispatch({ type: "OPEN_WINDOW", payload: "openProject" }),
        openQuit: () => dispatch({ type: "OPEN_WINDOW", payload: "quit" })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
