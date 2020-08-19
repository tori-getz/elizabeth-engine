
import React, { Component } from "react"
import { connect } from "react-redux";

import StartScreen from "./screens/StartScreen";
import Editor from "./screens/Editor";

class App extends Component {
    constructor () {
        super();
    }
    render () {
        return (
            <div>
                {this.props.workdir !== "" ? <Editor /> : <StartScreen />}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return state;
}

export default connect(mapStateToProps)(App);
