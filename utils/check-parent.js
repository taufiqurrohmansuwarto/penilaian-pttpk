import { has } from "lodash";

const myArr = (target, data) => {
    const arrFilter = data?.find((d) => d?.id === target);

    if (has(arrFilter, "parent")) {
        const filter = data?.filter((d) => d?.id !== target);
        return myArr(arrFilter?.parent, filter);
    } else {
        return arrFilter?.id;
    }
};

module.exports = myArr;
