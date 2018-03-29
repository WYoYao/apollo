# Setup guide for Express

### 1.Enable Tracing and Cache Control in Apollo Server

> 添加 **tracing: true** 和 **cacheControl: true** 给 apollo 服务器中间件功能的选项。

```javascript
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      context: {},
      tracing: true,
      cacheControl: true
    };
  })
);
```

### Get an Engine API key

> 通过浏览器登录到[apollo 引擎](http://engine.apollographql.com/?_ga=2.61525676.1863686960.1522289025-1768413138.1521775998) 并创建一个服务来获取 api 密钥。我们会在下一步将它传递到我们的 apollo 引擎构造函数中。

### Add Engine to your server

> 首先，下载 apollo-engine

```
npm install --save apollo-engine
```

> 首先导入 **ApolloEngine** 构造函数,创建一个引擎, 用 **engine.listen()** 替换 app.listen()。引擎现在将包装您的端点并处理 graphql 请求和响应。

```javascript
// Import ApolloEngine
const { ApolloEngine } = require('apollo-engine');

// Initialize your Express app like before
const app = express();

// All of your GraphQL middleware goes here
app.use('/graphql', ...);

// Initialize engine with your API key
const engine = new ApolloEngine({
  apiKey: 'API_KEY_HERE'
});

// Call engine.listen instead of app.listen(port)
engine.listen({
  port: 3000,
  expressApp: app,
});
```

### API

> 如果你需要额外的配置，你来对地方了。(配置 Engine 的地方)

> 以下是一些常用的值得了解的配置：

```javascript
const engine = new ApolloEngine({
  //  唯一必填项 从网站上面获取的key
  apiKey: process.env.API_KEY,

  //指定引擎代理如何连接到GraphQL源（您的节点GraphQL服务器）的行为。 虽然代理支持多个来源，但大多数用户只会在该数组中放置一个来源。
  origins: [
    {
      // 如果您正在使用apollo-link-batch-http软件包将多个GraphQL请求合并为一个HTTP请求，请将其设置为确保引擎代理也将它们作为单个请求发送到Node Web服务器。 （如果你没有设置这个，代理将把它拆分成单独的HTTP请求。）
      supportsBatch: true,
      // 等待 Node GraphQL服务器在超时之前返回响应的时间量。 默认为“30s”。 指定为包含数字和单位（例如“ms”或“s”）的字符串。
      requestTimeout: "60s",
      // HTTP特定的选项。 （上述选项也适用于其他来源类型，例如Lambda。）
      http: {
        //引擎代理将在它向您的GraphQL服务器发出的所有请求中设置以下请求标头。
        overrideRequestHeaders: {
          // 默认情况下，引擎代理将根据用户的请求保留主机头。
          host: "mysite.example.com"
        }
      }
    }
  ],

  //指定Engine Proxy如何侦听HTTP服务器的行为。 虽然代理支持多个监听前端，但大多数用户只会在该阵列中放置一个前端。
  frontends: [
    {
      // Specify behavior for handling GraphQL extensions in GraphQL
      // responses.
      //指定在GraphQL响应中处理GraphQL扩展的行为。
      extensions: {
        // Extensions which will never be returned to clients.
        // Defaults to ['tracing'].
        // 永远不会返回给客户的扩展。 默认为['追踪']。
        blacklist: ["tracing", "cacheControl"],
        // Extensions to only return to clients if the client requests
        // them.  Defaults to `['tracing', 'cacheControl']`.
        // 如果客户端请求它们，扩展只返回给客户端
        // 默认  `['tracing', 'cacheControl']`.
        strip: ["tracing"]
      }
    }
  ],

  // Resize the default in-memory cache.
  // 调整默认的内存中缓存大小。
  stores: [
    {
      inMemory: {
        cacheSize: 104857600 // 100 MB; defaults to 50MB.
      }
    }
  ],
  sessionAuth: {
    // Use the value of the 'session-id' cookie to isolate responses
    // in the private full query cache from those from other sessions.
    // 使用'session-id'cookie的值来隔离私有完整查询缓存中的响应与其他会话中的响应。
    cookie: "session-id"
  },
  queryCache: {
    // Turn off the public full query cache. The cache is only used for
    // responses with the 'cache-control' GraphQL extension.
    // 关闭公开的完整查询缓存。 缓存仅用于“缓存控制”GraphQL扩展的响应。
    publicFullQueryStore: "disabled"
  },

  logging: {
    // Only show warnings and errors, not info messages.
    // 只显示警告和错误，而不是信息消息。
    level: "WARN"
  }
});
```

https://www.apollographql.com/docs/engine/setup-node.html

engine.listen(options, [callback])
