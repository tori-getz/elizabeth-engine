
export default function (payload, state) {
    let newState = {...state};

    newState.opened[payload] = false;

    return newState;
}
