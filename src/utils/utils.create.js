let lookup = {};
const mapIt = (node) => {
    lookup[node.id] = node;
    //recursive on all the children
    node.children && node.children.forEach(mapIt);
};

function findAncestors(nodeId) {
    var ancestors = [];
    var parentId = lookup[nodeId] && lookup[nodeId].parentId;
    while (parentId !== undefined) {
        ancestors.unshift(parentId);
        parentId = lookup[parentId] && lookup[parentId].parentId;
    }
    return ancestors;
}
