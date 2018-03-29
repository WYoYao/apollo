## Passing options (传递选项)

> 参数为的单个 GraphQLOptions 对象
> apollo 服务器接受一个 GraphQLOptions 对象作为它的单个参数，就像这样（for express）：

```javascript
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema: myGraphQLSchema
    // other options here
  })
);
```

> 参数 GraphQLOptions 为一个函数如果您需要根据每个请求更改选项，则也可以将这些选项作为函数传递，在这种情况下，您会将 req 对象或类似参数作为参数进行传递：如果您需要在每个请求的基础上将对象附加到上下文，例如初始化用户数据，缓存像 dataloader 这样的工具或设置一些 API 密钥，这非常有用。

```javascript
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema: myGraphQLSchema,
      context: {
        value: req.body.something // 会作为第三个参数传入的到 resolvers  的属性对应的查询方法中
      }
      // other options here
    };
  })
);
```

## Options API

> GraphQLOptions:属性如下

### schema

> 代表 graphql 模式的 graphql.js 模式对象。您可以使用 graphql.js（参考 graphql 实现）直接创建它，也可以使用 graphql-tools，这使得将模式和解析器组合起来变得非常简单。看例子。

### context

> 上下文是作为第三个参数在每个解析器中可访问的对象。这是传递依赖于当前请求的信息的好地方。在 [graphql-tools 文档](https://www.apollographql.com/docs/graphql-tools/resolvers.html#Resolver-function-signature) 中阅读有关解析器及其参数的更多信息。这里是一个例子：

```javascript
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => {
    // Some sort of auth function  获取请求中的数据, Cookie
    const userForThisRequest = getUserFromRequest(req);

    return {
      schema: myGraphQLSchema,
      context: {
        user: userForThisRequest
      }
      // other options here
    };
  })
);
```

### rootValue

> 这是作为根分析器的 obj 参数传递的值。在 graphql-tools 文档中阅读有关解析器及其参数的更多信息。注意：这个特性不常用，因为在大多数情况下，上下文是将每个请求数据传递给解析器的更好选择。

### formatError

> 在将错误返回给客户端之前对其进行格式化的功能。默认情况下，graphql 会对错误进行一些处理，并且这是定制该错误的好地方。您还可以访问.originalerror 属性上的原始抛出错误：

```javascript
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => {
    // Some sort of auth function  获取请求中的数据, Cookie
    const userForThisRequest = getUserFromRequest(req);

    return {
      schema: myGraphQLSchema,
      context: {
        user: userForThisRequest
      },
      formatError: err => {
        if (err.originalError && err.originalError.error_message) {
            err.message = err.originalError.error_message;
        }
        return err;
      };
      // other options here
    };
  })
);
```

### Other options

> 以上是您大多数时间需要的唯一选项。以下是其他一些可用于解决各种情况的解决方案：

```javascript
// options object
const GraphQLOptions = {
  //  格式化查询参数
  formatParams?: Function,

  // * 额外请求的验证规则
  validationRules?: Array<ValidationRule>,

  // 格式化每个返回的参数
  formatResponse?: Function

  // 一个自定义的默认字段解析器
  fieldResolver?: Function

  // 一个布尔值，如果发生执行错误，将会打印更多的调试日志
  debug?: boolean
}
```
