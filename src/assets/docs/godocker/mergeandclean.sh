rm /tmp/vid/tmp/mylist.txt 2> /dev/null
for f in /tmp/vid/tmp/*.mp4; do echo "file '$f'" >> /tmp/vid/tmp/mylist.txt; done
mkdir /tmp/vid/result
ffmpeg -f concat -i /tmp/vid/tmp/mylist.txt -c copy /tmp/vid/result/result.mp4
rm -rf /tmp/vid/tmp

