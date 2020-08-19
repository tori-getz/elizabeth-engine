
export default function (payload, state) {
    let newState = {...state};
    let codeEdit = [];
    
    for (let file of state.codeEdit) {
        if (file !== payload) {
            codeEdit.push(file);
        }
    }

    newState.codeEdit = codeEdit;

    return newState;
}
