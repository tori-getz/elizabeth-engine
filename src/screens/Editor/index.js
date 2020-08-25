
import React, { Component } from "react";
import { connect } from "react-redux";
import { CommandBar, AppBarButton } from "react-uwp";
import Helmet from "react-helmet";
import _ from "lodash";

import Quit from "../../components/Quit";
import Logs from "../../components/Logs";
import ProjectSettings from "../../components/ProjectSettings";
import Sprites from "../../components/Sprites";
import CodeEditor from "../../components/CodeEditor";
import Code from "../../components/Code";
import Scenes from "../../components/Scenes"

class Editor extends Component {
    constructor () {
        super();

        this.state = {
            codeEdit: []
        };

        this.runBuild = this.runBuild.bind(this);
    }

    componentDidMount () {
        this.setState({
            codeEdit: this.props.codeEdit
        });
    }

    runBuild () {
        console.log("Run build...");

        window.ipcRenderer.send("run_build");
    }

    render () {
        return ( 
            <div>
                <Helmet>
                    <title> {this.props.workdir} - Elizabeth Engine </title>
                </Helmet>

                {this.props.opened.quit ? <Quit /> : ""}
                {this.props.opened.logs ? <Logs /> : ""}
                {this.props.opened.sprites ? <Sprites /> : ""}
                {this.props.opened.scenes ? <Scenes /> : ""}
                {this.props.opened.projectSettings ? <ProjectSettings /> : ""}
                
                {this.props.opened.code ? <Code /> : ""}

                {!_.isEmpty(this.state.codeEdit)
                ?
                    this.props.codeEdit.map((codeFile, index) => {
                        return (
                            <CodeEditor
                                key={index}
                                file={codeFile}
                            />
                        );
                    })
                :
                    ""
                }

                <CommandBar
                    isMinimal
                    content={this.props.editScene.name}
                    labelPosition="right"
                    primaryCommands={[
                        <AppBarButton icon="CommandPrompt" label="Logs" onClick={this.props.openLogs} />,
                        <AppBarButton icon="Play" label="Build & Run" onClick={this.runBuild}/>,
                        <AppBarButton icon="Video" label="Viewport" />,
                        <AppBarButton icon="ShowBcc" label="Entities" />,
                        <AppBarButton icon="MapLayers" label="Scenes" onClick={this.props.openScenes} />
                    ]}
                    secondaryCommands={[
                        <p onClick={() => {
                            console.log("Save project...");
                            window.ipcRenderer.send("save_project", this.props.project);
                        }}> Save </p>,
                        <p onClick={this.props.openProjectSettings}> Project settings </p>,
                        <p onClick={this.props.openSprites}> Sprites </p>,
                        <p onClick={this.props.openCode}> Code </p>,
                        <p onClick={this.props.openQuit}> Quit </p>
                    ]}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispatchToProps (dispatch) {
    return {
        openQuit: () => dispatch({ type: "OPEN_WINDOW", payload: "quit" }),
        openLogs: () => dispatch({ type: "OPEN_WINDOW", payload: "logs" }),
        openSprites: () => dispatch({ type: "OPEN_WINDOW", payload: "sprites" }),
        openCode: () => dispatch({ type: "OPEN_WINDOW", payload: "code" }),
        openScenes: () => dispatch({ type: "OPEN_WINDOW", payload: "scenes" }),
        openProjectSettings: () => dispatch({ type: "OPEN_WINDOW", payload: "projectSettings" })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
