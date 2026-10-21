from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser, urllib.request
os.chdir(Path(__file__).resolve().parent / 'public')
url='http://127.0.0.1:8766/tzgro-card-tycoon.html'
try:
    server=ThreadingHTTPServer(('127.0.0.1',8766),SimpleHTTPRequestHandler)
except OSError:
    try:
        with urllib.request.urlopen(url,timeout=3) as r:
            if r.status==200: webbrowser.open(url)
    except Exception:
        print('8766 埠已被其他程式使用，請先關閉該程式再啟動。')
else:
    webbrowser.open(url)
    print('遊戲已啟動，請保留此視窗；關閉會停止預覽。')
    server.serve_forever()
