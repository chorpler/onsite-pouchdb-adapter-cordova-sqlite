let assign;
if (typeof Object.assign === 'function') {
    assign = Object.assign;
}
else {
    // lite Object.assign polyfill based on
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    assign = function (target, ...args) {
        const to = Object(target);
        const params = [target, ...args];
        for (let index = 1; index < params.length; index++) {
            const nextSource = params[index];
            if (nextSource != null) { // Skip over if undefined or null
                for (const nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}
export default assign;
export { assign };
// module.exports = assign;
//# sourceMappingURL=assign.js.map