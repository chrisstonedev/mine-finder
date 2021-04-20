window.addEventListener('DOMContentLoaded', function () {
    var replaceText = function (selector, text) {
        var element = document.getElementById(selector);
        if (element && text !== undefined)
            element.innerText = text;
    };
    for (var _i = 0, _a = ['chrome', 'node', 'electroon']; _i < _a.length; _i++) {
        var type = _a[_i];
        replaceText(type + "-version", process.versions[type]);
    }
});
