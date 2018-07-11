module.exports = {
    extend: function (old, n) {
        for (var key in n) {
            old[key] = n[key];
        }
    }
}