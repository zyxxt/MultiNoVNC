module.exports = (function () {

    return {
        parseFormData: function (formData) {
            var arr = formData.split('&'),
                ret = {};
            arr.every(function (item) {
                var a = item.split('=');
                ret[a[0]] = a[1];
                return true;
            });
            return ret;
        }
    };

} ());