# POST and GET format

### POST requests

> apollo 服务器接受带有 json 主体的 post 请求。一个有效的请求必须包含一个查询或一个操作名（或者两者，如果是命名查询），并且可能包含变量。以下是一个有效的发布请求的示例：

```javascript
{
  "query": "query aTest($arg1: String!) { test(who: $arg1) }", //  查询
  "operationName": "aTest", // 操作名
  "variables": { "arg1": "me" }
}
```

> 变量可以是一个对象或一个 json 编码的字符串。

```javascript
{
  "query": "query aTest($arg1: String!) { test(who: $arg1) }",
  "operationName": "aTest",
  "variables": "{ \"arg1\": \"me\" }"
}
```

### Batching

```javascript
{               // 一颗树查询出来对应的数据
  books {
    title
    author
  }
  people{
    name
    age
  }
  all{
    book {
      title
      author
    }
  }
}

// 直接用 Postman 请求

[
    {"query":"{books{\n    title\n    author\n  }}"},
    {"query":"{people{\n    name\n    age\n  }}"},
    {"query":"{all{\n    book {\n      title\n      author\n    }\n    persion {\n      name\n      age\n    }\n  }}"}
]

var a=JSON.stringify([
    {
        "query":`{
            books{
                title
                author
            }
        }`
    },
    {
        "query":`{
            people{
                name
                age
            }
        }`
    },
    {
        "query":`{
            all{
                book {
                    title
                    author
                }
                persion {
                    name
                    age
                }
            }
        }`
    }
]);
```

### GET requests

> Apollo 服务器也接受请求。get请求必须通过url中的查询和可选的变量和操作名称。
