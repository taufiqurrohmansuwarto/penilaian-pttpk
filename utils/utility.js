import { capitalize } from "lodash";

export const capitalCase = (str) => {
    return str?.replace(/\w+/g, capitalize);
};
