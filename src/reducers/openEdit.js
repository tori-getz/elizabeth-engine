
export default function (payload, state) {
    let newState = {...state};

    newState.codeEdit.push(payload);

    return newState;
}
