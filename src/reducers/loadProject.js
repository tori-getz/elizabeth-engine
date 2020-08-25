
export default function (payload, state) {
    let newState = {...state};

    newState.workdir = payload.workdir;
    newState.project = payload.project;

    if (payload.editScene) {
        newState.editScene = payload.editScene;
    }

    return newState;
}
