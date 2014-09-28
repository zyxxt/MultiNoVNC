"use strict";
var Base = function () {
    // 这里不要调用onInit了，让外部手动调用吧
};

Base.prototype = {

    onInit: function (req, res) {
        this.setRequest(req);
        this.setResponse(res);
    },

    setRequest: function (req) {
        this._request = req;
    },

    setResponse: function (res) {
        this._response = res;
    },

    beforeRun: function () {},

    run: function () {
        this.beforeRun.apply(this, arguments);
        console.log('route run...');
    }

};

module.exports = Base;