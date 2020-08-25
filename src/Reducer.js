
import close from "./reducers/close";
import open from "./reducers/open";
import edtiSettings from "./reducers/edtiSettings";
import loadProject from "./reducers/loadProject";
import openEdit from "./reducers/openEdit";
import closeEdit from "./reducers/closeEdit";
import setEditScene from "./reducers/setEditScene"

export default function Reducer (state, action) {
    let newState = {...state};
    console.log(newState);
    switch (action.type) {
        case "SET_EDIT_SCENE":
            newState = setEditScene(action.payload, state);
            return newState;

        case "OPEN_EDIT":
            newState = openEdit(action.payload, state);
            return newState;

        case "CLOSE_EDIT":
            newState = closeEdit(action.payload, state);
            return newState;

        case "LOAD_PROJECT":
            newState = loadProject(action.payload, state);
            return newState;

        case "SAVE_PROJECT":
            newState = loadProject(action.payload, state);
            return newState;

        case "EDIT_SETTINGS":
            newState = edtiSettings(action.payload, state);
            return newState;

        case "OPEN_WINDOW":
            newState = open(action.payload, state);
            return newState;

        case "CLOSE_WINDOW":
            newState = close(action.payload, state);
            return newState;

        default:
            newState = {...state};
            return newState;
    }
}
