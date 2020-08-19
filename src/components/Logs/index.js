
import React, { Component } from "react";
import Draggable from "react-draggable";
import { CommandBar } from "react-uwp";
import { connect } from "react-redux";
import ReactHTMLParser from "react-html-parser";

const style = {
    wrapper: {
        width: "800px",
        position: "absolute"
    },
    log: {
        marginTop: 10,
        width: "100%"
    }
}

class OpenProject extends Component {
    constructor () {
        super();

        this.state = {
            logs: <b> No logs </b>
        }
    }

    componentWillMount () {
        window.ipcRenderer.on("logs", (event, message) => {
            if (message.type === "err") {
                this.setState({
                    logs: <b style={{ color: "#ff0000" }}> Error logs </b>
                });
            }

            if (message.type === "stderr") {
                this.setState({
                    logs: <p> {ReactHTMLParser(message.logs)} </p>
                });
            }

            if (message.type === "stdout") {
                this.setState({
                    logs: <p> {ReactHTMLParser(message.logs)} </p>
                });
            }
        });
    }

    render () {
        let secondaryCommands = [ <p onClick={() => { this.props.closeLogs() }}> Close </p> ];

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar 
                        content="Logs"
                        secondaryCommands={secondaryCommands}
                    />

                    <p style={style.log}>{this.state.logs}</p>
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
        closeLogs: () => dispatch({ type: "CLOSE_WINDOW", payload: "logs" }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenProject);
