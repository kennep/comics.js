#!/bin/sh
cp `dirname $0`/rc.d/comics /usr/local/etc/rc.d/comics
cp -r `dirname $0`/../build/ /var/www/comics/
