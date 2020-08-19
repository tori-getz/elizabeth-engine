
export default function (payload, state) {
    let newState = {...state};

    console.log(newState);

    newState.workdir = payload.workdir;
    newState.project = payload.project;

    return newState;
}
