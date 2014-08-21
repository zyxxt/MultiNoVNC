
from vncdotool import command

import unittest

import mock


class TestBuildCommandList(unittest.TestCase):

    def setUp(self):
        super(TestBuildCommandList, self).setUp()
        self.isolation = mock.isolate.object(command.build_command_list)
        self.isolation.start()
        self.factory = mock.Mock()
        self.client = command.VNCDoToolClient
        self.deferred = self.factory.deferred

    def tearDown(self):
        if self.isolation:
            self.isolation.stop()
            self.isolation = None


    def assertCalled(self, fn, *args):
        self.deferred.addCallback.assert_called_with(fn, *args)

    def call_build_commands_list(self, commands, **kwargs):
        command.build_command_list(self.factory, commands.split(), **kwargs)

    def test_alphanum_key(self):
        self.call_build_commands_list('key a')
        self.assertCalled(self.client.keyPress, 'a')

    def test_control_key(self):
        self.call_build_commands_list('key ctrl-c')
        self.assertCalled(self.client.keyPress, 'ctrl-c')

    def test_keyup(self):
        self.call_build_commands_list('keyup a')
        self.assertCalled(self.client.keyUp, 'a')

    def test_keydown(self):
        self.call_build_commands_list('keydown a')
        self.assertCalled(self.client.keyDown, 'a')

    def test_key_missing(self):
        pass

    def test_move(self):
        self.call_build_commands_list('move 100 200')
        self.assertCalled(self.client.mouseMove, 100, 200)

    def test_move(self):
        self.call_build_commands_list('mousemove 100 200')
        self.assertCalled(self.client.mouseMove, 100, 200)

    def test_move_missing(self):
        pass

    def test_click(self):
        self.call_build_commands_list('click 1')
        self.assertCalled(self.client.mousePress, 1)

    def test_click_missing(self):
        pass

    def test_type(self):
        self.call_build_commands_list('type foobar')
        call = self.factory.deferred.addCallback
        for key in 'foobar':
            call.assert_calls_exist_with(self.client.keyPress, key)

    def test_type_missing(self):
        pass

    def test_capture(self):
        command.SUPPORTED_FORMATS = ('png',)
        command.os.path.splitext.return_value = 'capture', '.png'
        self.call_build_commands_list('capture foo.png')
        self.assertCalled(self.client.captureScreen, 'foo.png')

    def test_capture_not_supported(self):
        command.SUPPORTED_FORMATS = ('png',)
        command.os.path.splitext.return_value = 'capture', '.mpeg'
        self.call_build_commands_list('capture foo.mpeg')
        assert not self.deferred.addCallback.called

    def test_capture_missing_filename(self):
        pass

    def test_expect(self):
        self.call_build_commands_list('expect foo.png 10')
        self.assertCalled(self.client.expectScreen, 'foo.png', 10)

    def test_expect_not_png(self):
        pass

    def test_expect_missing(self):
        pass

    def test_chain_key_commands(self):
        self.call_build_commands_list('type foobar key enter')
        call = self.factory.deferred.addCallback
        for key in 'foobar':
            call.assert_calls_exist_with(self.client.keyPress, key)
        call.assert_calls_exist_with(self.client.keyPress, 'enter')

    def test_chain_type_expect(self):
        self.call_build_commands_list('type username expect password.png 0')
        call = self.factory.deferred.addCallback
        for key in 'username':
            call.assert_calls_exist_with(self.client.keyPress, key)

        call.assert_calls_exist_with(self.client.expectScreen, 'password.png', 0)

    def test_pause(self):
        self.call_build_commands_list('pause 0.3')
        self.assertCalled(self.client.pause, 0.3)

    def test_sleep(self):
        self.call_build_commands_list('sleep 1')
        self.assertCalled(self.client.pause, 1)

    def test_pause_warp(self):
        self.call_build_commands_list('pause 10', warp=5)
        self.assertCalled(self.client.pause, 2.0)

    def test_mousedown(self):
        self.call_build_commands_list('mousedown 1')
        self.assertCalled(self.client.mouseDown, 1)

        self.call_build_commands_list('mdown 2')
        self.assertCalled(self.client.mouseDown, 2)

    def test_mouseup(self):
        self.call_build_commands_list('mouseup 1')
        self.assertCalled(self.client.mouseUp, 1)

        self.call_build_commands_list('mup 2')
        self.assertCalled(self.client.mouseUp, 2)

    def test_drag(self):
        self.call_build_commands_list('drag 100 200')
        self.assertCalled(self.client.mouseDrag, 100, 200)


    def test_insert_delay(self):
        self.call_build_commands_list('click 1 key a', delay=100)
        expected = [ mock.call(self.client.mousePress, 1),
                     mock.call(self.client.pause, 0.1),
                     mock.call(self.client.keyPress, 'a')]

        self.assertEqual(self.deferred.addCallback.call_args_list, expected)


class TestParseHost(object):

    def setUp(self):
        self.isolation = mock.isolate.object(command.parse_host)
        self.isolation.start()
        self.options = mock.Mock()
        self.options.server = '127.0.0.1'
        parse_args = command.VNCDoToolOptionParser.return_value.parse_args
        parse_args.return_value = (self.options, [])

    def tearDown(self):
        if self.isolation:
            self.isolation.stop()
            self.isolation = None

    def test_default(self):
        host, port = command.parse_host('')
        assert host == '127.0.0.1'
        assert port == 5900

    def test_host_display(self):
        host, port = command.parse_host('10.11.12.13:10')
        assert host == '10.11.12.13'
        assert port == 5910

    def test_host_port(self):
        host, port = command.parse_host('10.11.12.13::4444')
        assert host == '10.11.12.13'
        assert port == 4444

    def test_just_host(self):
        host, port = command.parse_host('10.11.12.13')
        assert host == '10.11.12.13'
        assert port == 5900

    def test_just_display(self):
        host, port = command.parse_host(':10')
        assert host == '127.0.0.1'
        assert port == 5910

    def test_just_port(self):
        host, port = command.parse_host('::1111')
        assert host == '127.0.0.1'
        assert port == 1111
