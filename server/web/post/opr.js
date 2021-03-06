"use strict";

module.exports = (function () {
    var processList = [],
        vncPortList = [],
        vncCurPort = 61234;

    var createVNC = function (option) {
        var port = ++vncCurPort;
        var spawn = require('child_process').spawn,
            // 这里的路径是相对于整个项目启动时的目录
            child  = spawn('./server/novnc/utils/websockify', [port, option.host + ':' + option.port]);

        child.port = port;
        child.stdout.on('data', function (data) {
            console.log('websockify 标准输出：' + data);
        });
        child.stderr.on('data', function (data) {
            console.log('websockify 错误输出：' + data);
        });
        child.on('error', function () {
            console.log('websockify 进程出错');
            console.log(arguments);
        });
        child.on('exit', function (code, signal) {
            var portIndex = vncPortList.indexOf(vncCurPort);
            if (portIndex !== -1) {
                vncPortList.splice(portIndex, 1);
            }
            var pidIndex = processList.indexOf(child);
            if (pidIndex !== -1) {
                processList.splice(pidIndex, 1);
            }
            console.log('websockify 退出，code：%s, signal: %s', code, signal);
        });

        processList.push(child);
        return child.pid;
    };

    var getProcess = function (pid) {
        var process;
        processList.every(function (item, index) {
            if (parseInt(item.pid, 10) === parseInt(pid, 10)) {
                process = item;
                return false;
            }
            return true;
        });
        return process;
    };

    var removeVNC = function (pid) {
        var process = getProcess(pid);
        if (process) {
            process.kill();
            return true;
        }
        return false;
    };


    var printScreen = function (host, port, passwd, filename) {
        var spawn = require('child_process').spawn,
            child  = spawn('vncdo', ['-s', host + '::' + port, '-p', passwd, 'capture', filename]);

        child.stdout.on('data', function (data) {
            console.log('vncdotool 标准输出：' + data);
        });
        child.stderr.on('data', function (data) {
            console.log('vncdotool 错误输出：' + data);
        });
        child.on('error', function () {
            console.log('vncdotool 进程出错');
            console.log(arguments);
        });
        child.on('exit', function (code, signal) {
            console.log('vncdotool 退出，code：%s, signal: %s', code, signal);
        });
    };



    return {
        getProcess: getProcess,
        createVNC: createVNC,
        removeVNC: removeVNC,

        printScreen: printScreen
    };

} ());