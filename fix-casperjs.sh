#!/bin/sh
for dstFname in $*
do
  echo "fixing for casper:"$dstFname
  srcFname=$(dirname $dstFname)/.$(basename $dstFname)
  mv $dstFname $srcFname
  (echo 'exports = {};'; cat $srcFname) > $dstFname
  rm $srcFname
done
