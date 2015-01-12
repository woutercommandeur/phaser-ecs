var utils = module.exports = {};

utils.ComponentRegister = (function() {
    var nextType = 0;
    var ctors = [];
    var types = [];

    return {
        register: function(ctor) {
            var i = ctors.indexOf(ctor);
            if (i < 0) {
                ctors.push(ctor);
                types.push(nextType++);
                return nextType-1;
            } else {
                return types[i];
            }
        },
        get: function(ctor) {
            var i = ctors.indexOf(ctor);
            if (i < 0) {
                throw "Unknown type " + ctor;
            }

            return types[i];
        }
    };
})();

utils.inherits = function(ctor, superCtor, methods) {
    ctor.prototype = Object.create(superCtor.prototype);
    ctor.prototype.constructor = ctor;

    if (methods) {
        for (var p in methods) {
            if (methods.hasOwnProperty(p)) {
                ctor.prototype[p] = methods[p];
            }
        }
    }
};
