
export default function (payload, state) {
    let newState = {...state};

    newState.editScene = payload.editScene;

    return newState;
}
