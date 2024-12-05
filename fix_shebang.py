#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 Red Dove Consultants Limited
#
# Redistribution and use in source and binary forms, with or without modification, are
# permitted provided that the following conditions are met:
#
#   1. Redistributions of source code must retain the above copyright notice, this list
#      of conditions and the following disclaimer.
#
#   2. Redistributions in binary form must reproduce the above copyright notice, this
#      list of conditions and the following disclaimer in the documentation and/or
#      other materials provided with the distribution.
#
#   3. Neither the name of the copyright holder nor the names of its contributors may
#      be used to endorse or promote products derived from this software without
#      specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
# EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
# OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
# SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
# TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
# BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
# DAMAGE.
#
import argparse
import io
import os
import shutil
import struct
import sys
import zipfile

DEBUGGING = 'PY_DEBUG' in os.environ
DEFAULT_SHEBANG = '#! /usr/bin/env python'

def _examine_possible_archive(s):
    launcher = shebang = data = None
    is_binary = False
    try:
        with open(s, 'rb') as f:
            all_data = f.read()
        pos = all_data.rfind(b'PK\x05\x06')
        if pos < 0:
            n = all_data.find(b'\n')
            if n > 2 and all_data.startswith(b'#!'):
                shebang = all_data[:n].rstrip(b'\r')
                data = all_data[n + len(os.linesep):]
            else:
                is_binary = True
        else:  # it could be a zip archive
            end_cdr = all_data[pos + 12:pos + 20]
            cdr_size, cdr_offset = struct.unpack('<LL', end_cdr)
            arc_pos = pos - cdr_size - cdr_offset
            if arc_pos < 0 or arc_pos > len(all_data):
                is_binary = True
            else:
                data = all_data[arc_pos:]
                if arc_pos > 0:
                    pos = all_data.rfind(b'#!', 0, arc_pos)
                    if pos >= 0:
                        shebang = all_data[pos:arc_pos]
                        if pos > 0:
                            launcher = all_data[:pos]
                stream = io.BytesIO(data)
                try:
                    with zipfile.ZipFile(stream) as zf:
                        if zf.testzip():
                            is_binary = True
                except zipfile.BadZipfile:
                    is_binary = True
    except Exception:
        pass
    return launcher, shebang, data, is_binary

def first_line(shebang):
    result = shebang
    pos = result.find(os.linesep.encode('utf-8'))
    if pos > 0:
        result = result[:pos]
    return result

def process(options):
    for target in options.targets:
        if not os.path.isfile(target):
            msg = 'Not a file: %s' % target
        else:
            launcher, shebang, data, is_binary = _examine_possible_archive(target)
        if options.list:
            if shebang is None:
                msg = 'a shebang was not found'
                assert is_binary, 'binary expected'
            else:
                msg = shebang.decode('utf-8')
            print('%s: %s' % (target, msg))
        else:
            if not os.path.isfile(target):
                print('%s: no such file' % target)
                continue
            if is_binary:
                print('%s: %s' % (target, 'binary file unchanged'))
                continue
            if not options.outdir:
                raise ValueError('output directory not specified')
            elif not os.path.isdir(options.outdir):
                raise ValueError('not a directory: %s' % options.outdir)
            new_shebang = options.shebang.encode('utf-8')
            if not new_shebang.startswith(b'#!'):
                new_shebang = b'#!' + new_shebang
            if shebang == new_shebang:
                print('%s: shebang unchanged - "%s"' % (target, shebang.decode('utf-8')))
            else:
                out = launcher if launcher else b''
                out += new_shebang + os.linesep.encode('utf-8') + data
                _, basename = os.path.split(target)
                p = os.path.join(options.outdir, basename)
                with open(p, 'wb') as f:
                    f.write(out)
                shutil.copystat(target, p)
                print('%s: shebang changed "%s" -> "%s", written to %s' % (target,
                      first_line(shebang).decode('utf-8'), new_shebang.decode('utf-8'),
                      p))

def main():
    adhf = argparse.ArgumentDefaultsHelpFormatter
    ap = argparse.ArgumentParser(formatter_class=adhf,
                                 description='View or update shebang lines in '
                                             'text files and archives')
    aa = ap.add_argument
    aa('-s', '--shebang', default=DEFAULT_SHEBANG, metavar='SHEBANG',
       help='Shebang to use')
    aa('-l', '--list', default=False, action='store_true', help='List shebangs of targets')
    aa('-o', '--outdir', default=None, metavar='OUTDIR', help='Output directory')
    aa('-v', '--verbose', default=False, action='store_true', help='Increase output verbosity')
    aa('targets', nargs='+', metavar='TARGET', help='Target file to operate on')
    options = ap.parse_args()
    if options.list and options.shebang != DEFAULT_SHEBANG:
        raise ValueError('You can\'t specify -l/--list and as well as -s/--shebang')
    process(options)

if __name__ == '__main__':
    try:
        rc = main()
    except KeyboardInterrupt:
        rc = 2
    except Exception as e:
        if DEBUGGING:
            s = ' %s:' % type(e).__name__
        else:
            s = ''
        sys.stderr.write('Failed:%s %s\n' % (s, e))
        if DEBUGGING: import traceback; traceback.print_exc()
        rc = 1
    sys.exit(rc)
