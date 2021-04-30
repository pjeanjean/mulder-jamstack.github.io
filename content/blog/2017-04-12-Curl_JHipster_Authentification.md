---
layout: blog-post
title: Play with curl to test generated JHipster application API 
place: Rennes, France
categories: [jhipster,swagger,curl,authentification]
published: true
---



I often used [JHipster](https://jhipster.github.io/) to create my Rest API. I often want to test this API using [curl](https://curl.haxx.se/).  
However, if you tak the curl command line method from swagger, it always misses the authentification mechanism. 

To manage this authentification, you can use the following commands. 

# If you use oauth:

<!--more-->


## Generate the XSRF-TOKEN 


Create the XSRF-TOKEN and save it to the file cookies.txt

```bash 
curl -v -c cookies.txt -b cookies.txt http://yourserverip:8080/oauth/token
 
```

## Manage the authentication

Do the authentification with **admin**, **admin** and save the session id to cookies.txt


```bash 
curl -v -c cookies.txt -b cookies.txt 'http://yourserverip:8080/api/authentication' -H 'Accept: application/json, text/plain, */*'  -H 'Connection: keep-alive' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Host: yourserverip.fr:8080' -H 'Referer: http://yourserverip:8080/'  -H "X-XSRF-TOKEN: `cat cookies.txt |grep XSRF-TOKEN | awk '{print $7}'`" --data 'j_username=admin&j_password=admin&remember-me=true&submit=Login'
```

## Test your api

From the curl command line provided by swagger, you have to remove the --header 'X-XSRF-TOKEN:  .... and add the -b cookies.txt 


```bash 
curl -b cookies.txt -X GET --header 'Accept: application/json'  'http://yourserverip:8080/api/account'
```


# If you use JWT:

It is easier.

```bash
export ID=`curl  -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  "password": "admin",  "rememberMe": true,  "username": "admin"  }' 'https://yourserverip:8080/api/authenticate' | jq -r .id_token`
```

puis je passe ma requête en réutilisant ce token dans le header

```bash
curl  --header 'Content-Type: application/json' --header 'Accept: application/json' --header "Authorization: Bearer $ID" -d 'yourjson' 'https://yourserverip:8080/api/yourendpoint'
```

Enjoy ....
