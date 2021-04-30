mkdir /tmp/vid/tmp && mkvmerge --split 4M --compression 0:none --compression 1:none --clusters-in-meta-seek -o "/tmp/vid/tmp/output.mkv" "/tmp/vid/tears_of_steel_1080p.mkv" && for f in /tmp/vid/tmp/*.mkv; do echo "/root/bin/ffmpeg  -i $f -c:v libx265 -preset medium -x265-params crf=28 -c:a aac -strict experimental -b:a 128k $f.mp4"> "$f.sh"; done

