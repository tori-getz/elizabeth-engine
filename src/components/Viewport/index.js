
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import Draggable from "react-draggable";
import { CommandBar } from "react-uwp";

const style = {
    wrapper: {
        position: "absolute",
        width: 640
    }
};

const Canvas = props => {
    let canvasRef = React.useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        for (let entity of props.scene.entities) {
            for (let sprite of props.sprites) {
                console.log(`ENTITY SPRITE ${entity.sprite}`);
                console.log(`CURRENT SPRITE ${sprite.name}`);
                if (sprite.name === entity.sprite) {
                    window.ipcRenderer.on(`${sprite.name}_sprite_loaded`, (event, message) => {
                        let image = new Image();

                        image.onload = () => {
                            ctx.drawImage(image, entity.pos.x + entity.pos.x, entity.pos.y + entity.pos.y, image.width + image.width, image.height + image.height);
                        }

                        image.src = `data:image/png;base64,${message}`;
                    });

                    window.ipcRenderer.send(`load_sprite`, sprite);
                }
            }
        }
    });

    return <canvas ref={canvasRef} width={640} height={480} style={{ backgroundColor: `#${props.scene.background}` }} />;
}

class Viewport extends Component {
    render () {
        let editScene = {};

        for (let scene of this.props.project.scenes) {
            if (scene.id === this.props.editScene.id) {
                editScene = scene;
            }
        }

        return (
            <Draggable>
                <div style={style.wrapper}>
                    <CommandBar
                        content="Viewport"
                        secondaryCommands={[ <p onClick={() => { this.props.closeViewport() }}> Close </p> ]}
                    />

                    <Canvas scene={editScene} sprites={this.props.project.resources.sprites} workdir={this.props.workdir} />
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
        closeViewport: () => dispatch({ type: "CLOSE_WINDOW", payload: "viewport" })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewport);
