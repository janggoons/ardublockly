from __future__ import unicode_literals, absolute_import

import getopt
import os
import platform
import re
import struct
import sys
import threading

from PyQt5.QtCore import QUrl
from PyQt5.QtWebKit import QWebSettings
from PyQt5.QtWebKitWidgets import QWebView, QWebPage
from PyQt5.QtWidgets import QApplication

import ardublocklyserver.compilersettings
import ardublocklyserver.server


class MyBrowser(QWebPage):
    ''' Settings for the browser.'''

    def userAgentForUrl(self, url):
        ''' Returns a User Agent that will be seen by the website. '''
        return "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"


class Browser(QWebView):

    def __init__(self):
        self.view = QWebView.__init__(self)
        self.setWindowTitle('Ardublockly')
        self.resize(1200, 800)
        self.loadFinished.connect(self._load_finished)

    def load(self, url):
        self.setUrl(QUrl(url))

    def disableJS(self):
        settings = QWebSettings.globalSettings()
        settings.setAttribute(QWebSettings.JavascriptEnabled, False)

    def closeEvent(self, evnt):
        super(Browser, self).closeEvent(evnt)
        sys.exit()

    def _load_finished(self):
        frame = self.page().mainFrame()
        self.page().setViewportSize(frame.contentsSize())
        self.resize(frame.contentsSize())


def start_pyyqt():

    print("Starting Pyqt5...")

    def _start_pyyqt():
        app = QApplication(sys.argv)
        view = Browser()
        view.show()
        view.load("http://localhost:%s/ardublockly/" % ardublocklyserver.server.PORT)
        app.exec_()

    thread = threading.Timer(0.5, _start_pyyqt)
    thread.start()



def find_ardublockly_dir(search_path):
    """
    Navigates within each node of a given path and tries to find the Ardublockly
    project root directory. It assumes that the project root with have an folder
    name ardublockly with an index.html file inside.
    This function is required because this script can end up in executable form
    in different locations of the project folder, and a literal relative path
    should not be assumed.

    :param search_path: Path in which to find the Ardublockly root project
                      folder.
    :return: Path to the Ardublockly root folder.
             If not found returns None.
    """
    path_to_navigate = os.path.normpath(search_path)
    # Navigate through each path node starting at the bottom until there are
    # no folders left
    while path_to_navigate:
        # Check if file /ardublokly/index.html exists within current path
        if os.path.isfile(
                os.path.join(path_to_navigate, 'ardublockly', 'index.html')):
            # Found the right folder, return it
            return path_to_navigate
        path_to_navigate = os.path.dirname(path_to_navigate)

    # The right folder wasn't found, so return input path
    return None


def parsing_cl_args():
    """
    Processes the command line arguments. Arguments supported:
    -h / --help
    -s / --serverroot <working directory>

    :return: Dictionary with available options(keys) and value(value).
    """
    # Set option defaults
    launch_browser = True
    server_root = None
    find_project_root = False

    if len(sys.argv) == 1:
        print("No command line arguments found.")
    else:
        try:
            opts, args = getopt.getopt(
                sys.argv[1:],
                'hs:bf',
                ['help', 'serverroot=', 'nobrowser', 'findprojectroot'])
        except getopt.GetoptError as e:
            print('There was a problem parsing the command line arguments:')
            print('\t%s' % e)
            sys.exit(1)

        for opt, arg in opts:
            if opt in ('-h', '--help'):
                print('Help flag parsed, these are the current options:\n')
                print('\t-s <folder>\tSets the server working directory.')
                print('\t-b\t\tSuppresses opening the local browser.')
                sys.exit(0)
            if opt in ('-s', '--serverroot'):
                # Windows only issue: In BlocklyRequestHandler, if chdir is fed
                # an 'incorrect' path like 'C:' instead of 'C:\' or C:/' it
                # fails silently maintaining the current working directory.
                # Use regular expressions to catch this corner case.
                if re.match("^[a-zA-Z]:$", arg):
                    print('The windows drive letter needs to end in a slash, ' +
                          'eg. %s\\' % arg)
                    sys.exit(1)
                # Check if the value is a valid directory
                arg = os.path.normpath(arg)
                if os.path.isdir(arg):
                    server_root = arg
                    print ('Parsed "%s" flag with "%s" value.' % (opt, arg))
                else:
                    print('Invalid directory "' + arg + '".')
                    sys.exit(1)
            elif opt in ('-b', '--nobrowser'):
                launch_browser = False
                print ('Parsed "%s" flag. No browser will be opened.' % opt)
            elif opt in ('-f', '--findprojectroot'):
                find_project_root = True
                print ('Parsed "%s" flag. The ardublockly project root will be '
                       'set as the server root directory.' % opt)
            else:
                print('Flag ' + opt + ' not recognised.')

    return find_project_root, launch_browser, server_root


def main():
    """
    Initialises the Settings singleton, resolves paths, and starts the server.
    """
    print('Running Python %s (%s bit) on %s' % (platform.python_version(),
                                                (struct.calcsize('P') * 8), platform.platform()))

    print('\n\n======= Parsing Command line arguments =======\n')
    find_project_root, launch_browser, server_root = parsing_cl_args()

    print('\n\n======= Resolving server and project paths =======\n')
    # Based on command line options, set the server root to the ardublockly
    # project root directory, a directory specified in the arguments, or by
    # default to the project root directory.
    this_file_dir = os.path.dirname(os.path.realpath(sys.argv[0]))
    ardublockly_root_dir = find_ardublockly_dir(this_file_dir)
    if ardublockly_root_dir is None:
        print('The Ardublockly project root folder could not be found within '
              'the %s directory !' % this_file_dir)
        sys.exit(1)
    print("Ardublockly root directory: %s" % ardublockly_root_dir)

    if find_project_root is True or server_root is None:
        server_root = ardublockly_root_dir
    else:
        # Arguments have set a server root, and to not find ardublockly dir
        if not os.path.commonprefix([server_root, ardublockly_root_dir]):
            print('The Ardublockly project folder needs to be accessible from '
                  'the server root directory !')
    print("Selected server root: %s" % server_root)

    print('\n\n======= Loading Settings =======')
    # ServerCompilerSettings is a singleton, no need to save instance
    ardublocklyserver.compilersettings.ServerCompilerSettings(
        ardublockly_root_dir)

    print('\n\n======= Starting Server =======\n')
    if launch_browser:
        # Find the relative path from server root to ardublockly html
        ardublockly_html_dir = os.path.join(ardublockly_root_dir, 'ardublockly')
        relative_path = os.path.relpath(ardublockly_html_dir, server_root)
        print("Ardublockly page relative path from server root: %s" %
              relative_path)

        start_pyyqt()

    ardublocklyserver.server.start_server(server_root)


if __name__ == '__main__':
    main()
