# Schema 和类型

### 类型语言

> GrapgQL 定义自己的语言,称之为 GraphQL Schema language。

### 对象类型和字段

> 一个 GraphQL Schema 中基本的组件是对象类型,它就是表示你可以从服务上获取到什么类型的对象,以及这个对象有什么字段。

### 参数（Arguments）

### 查询和变更类型（the Query and Mutation Types）

> 在 schema 中大部分的类型都是普通对象类型，但是一个 schema 内有两个特殊类型：

```
Schema{
    query:Query
    mutation:Mutation
}
```

> 每个 GraphQL 服务都有一个 query 类型，可能有一个 mutation 类型。这两个类型和常规类型误差，但是它们之所以特殊，是因为他们定义了每一个 GraphQL 查询的入口。

### 标量类型 （Scalar Types）

> 一个对象类型有自己的名称和字段，而某些时候，这些字段必然会解析到具体数据。这就是标量类型的来源，它们表示对应 GraphQ 查询的叶子节点。

> 我们知道这些字段没有任何次级字段--因为让它们是查询的叶子节点。

| 标识    | 含义                        |
| ------- | --------------------------- |
| Int     | 有符号 32 位整数            |
| Float   | 有符号双精度浮点值          |
| String  | UTF-8 字符序列。            |
| Boolean | true\false                  |
| ID      | ID 标量类型标识唯一的标识符 |

> 大部分的 GraphQL 　服务实现中的，都有自定义标量类型的方式。定义一个的 Date 类型

```javascript
scalar Date
```

### 枚举类型 (Enumeration Types)

> 也称作枚举,枚举类型是一种特殊的变量，它们限制在一个特殊的可选值集合内。这让你能够:

> 1.验证这个类型的任何参数是可选的某一个。  
> 2.与类型系统沟通,一个字段总是一个有限值集合的其中一个值。

> 下面是一个用 GraphQL schema 语言标识的 enum 定义:

```javascript
enum Episode{
    NEWHOPE
    EMPIRE
    JEDI
}
```

> 这表示无论我们在 schema 在哪处使用 Episode, 都可以肯定它返回的是 NEWHOPE,EMPIRE,JEDI。

### 类型修饰符

> 对象类型，标量以及枚举是 GraphQL 中你唯一可以定义的类型种类。但是当你在 schema 的其他部分使用这些类型时,或者在你的查询变量声明中使用时,你可以给它们应用额外的**类型修饰符**来影响这些值的验证。

```
type Character{
    name:String
    appersIn:[Episode]!
}
```

> 此处我们使用 String 类型，并通过给后面类型添加一个!,将其标注为非空。如果服务器返回一个空值, 会触发 GraphQL 执行错误。以让客户端知道发生了错误。

> 非空类型修饰符也可以用于定义字段上的参数，如果这个参数上传递了一个空值。不管的是用过 GraphQL 字符串还是变量，那么会导致服务器返回一个错误验证。

> 非空和列表修饰符可以组合使用

```
myField: [String!]
```

> 这表示数组本身可以为空，但是其不能有任何空值成员。用 JSON 举例如下：

```
myField: null // 有效
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 错误
```

> 不可为空的字符串数组

```
myField: [String]!
```

```
myField: null // 错误
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 有效
```

### 接口（Interfaces）

> 跟许多类型系统一样，GraphQL 支持接口。一个接口是一个抽象类型，它包含某些字段，而对象类型必须包含这些字段，才能算实现了这个接口。

```
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

> 这意味着任何实现 Character 的类型都要具有这些字段，并有对应参数和返回类型。

```
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

### 联合类型（Union Types）

> 联合类型和接口十分相似，但是它并不指定类型之间的任何共同字段。

```
union SearchResult = Human | Droid | Starship
```

> 在我们的schema中，任何返回一个 SearchResult 类型的地方，都可能得到一个 Human、Droid 或者 Starship。注意，联合类型的成员需要是具体对象类型；你不能使用接口或者其他联合类型来创造一个联合类型。

### 输入类型（Input Types）

> 目前为止，我们只讨论过将例如枚举和字符串等标量值作为参数传递给字段，但是你也能很容易地传递复杂对象。这在变更（mutation）中特别有用，因为有时候你需要传递一整个对象作为新建对象。在 GraphQL schema language 中，输入对象看上去和常规对象一模一样，除了关键字是 input 而不是 type：

```
input ReviewInput {
  stars: Int!
  commentary: String
}
```