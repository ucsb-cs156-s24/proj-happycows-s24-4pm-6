import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/commons",
        method: "DELETE",
        params: {
            id: cell.row.values["commons.id"]
        }
    }
}

export function commonsNotJoined(commons, commonsJoined) {
    const joinedIdList = commonsJoined.map(c => c.id);
    return commons.filter(f => !joinedIdList.includes(f.id));
}

