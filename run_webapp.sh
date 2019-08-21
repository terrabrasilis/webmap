#!/bin/bash

sudo docker run --rm --name webapp -p 8081:80 terrabrasilis/terrabrasilis-webapp:$1
