
export default function (payload, state) {
    let newState = {...state};

    newState.workdir = payload.workdir;
    newState.project = payload.project;

    return newState;
}
