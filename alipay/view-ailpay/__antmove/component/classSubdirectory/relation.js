let id = 0;

let RelationAst = {
    $nodes: {},
    $page: null,
    current: null,
    createArray: [],
    destoryArray: [],
    mountedHandles: [],
    componentNodes: {}
};

function createNode (ctx) {
    this.$self = ctx;
    ctx.$node = this;
    this.$id = id++;
    this.$children = [];
}

createNode.prototype = {
    getRootNode () {
        return RelationAst;
    },
    setParent (parent) {
        this.$parent = parent;
        parent.appendChild(this);
    },
    appendChildren () {
        this.$children
            .forEach((child) => {
                this.appendChild(child);
            });
    },
    appendChild (child) {
        this.$children.push(child);
        child.$parent = this;
    },
    removeChld (child) {
        this.$children = this.$children
            .filter(function (el) {
                return el.$id !== child.$id;
            });
    },
    _addComponentNode (className, ctx) {
        className = '.' + className;
        let componentNodes = this.getRootNode().componentNodes;
        if (componentNodes[className]) {
            componentNodes[className].push(ctx);
        } else {
            componentNodes[className] = [ctx];
        }
    },
    addComponentNodeId (id, ctx) {
        id = '#' + id;
        let componentNodes = this.getRootNode().componentNodes;
        if (componentNodes[id]) {
            componentNodes[id].push(ctx);
        } else {
            componentNodes[id] = [ctx];
        }
    },
    addComponentNode (className = '', ctx) {
        let classNameArray = className.split(/\s+/g);
        classNameArray.forEach((classNameStr) => {
            this._addComponentNode(classNameStr, ctx);
        });
    },
    selectComponent (className) {
        let componentNodes = this.getRootNode().componentNodes;
        return componentNodes[className] && componentNodes[className][0];
    },
    selectComponents (className) {
        let componentNodes = this.getRootNode().componentNodes;
        return componentNodes[className];
    }
};
module.exports = function (node, cb = () => {}) {
    let wrapNode = new createNode(node);
    if (node.is) {
        /**
       * component
       */
        RelationAst.$nodes[node.$id] = wrapNode;
    } else {
        /**
       * 页面节点信息初始化
       */
        RelationAst = {
            $nodes: {},
            $page: null,
            current: null,
            createArray: [],
            destoryArray: [],
            mountedHandles: [],
            componentNodes: {}
        };
        RelationAst.$page = wrapNode;
    }

    RelationAst.current = wrapNode;

    cb && cb(RelationAst);
    return RelationAst;
};