
export default function (payload, state) {
    let newState = {...state};

    newState.settings = payload;

    return newState;
}
