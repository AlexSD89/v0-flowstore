---
source: "https://mp.weixin.qq.com/s/hWON23L4WD_1vRZGbTgKbw"
created: 2025-04-21
---
Founder Park *2025年04月21日 20:32*

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/qpAK9iaV2O3sAVsSPfCN9UX44XiaoicbUJIrOGuaujdMNY6iaQewDZEX1GY3tcVk3QGeKJyUMMHBSMALvO8B7DZwsA/640?wx_fmt=gif&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

OpenAI 最近发布了一篇名为《A Practical guide to building AI agents》的指南，对于 Agent 框架、设计逻辑和编排模式等做了比较详细的说明，算是面向产品和工程团队的一份实用指南。

但 LangChain 创始人 Harrison Chase 对于 OpenAI 在文中的一些观点持有异议，尤其是「通过 LLMs 来主导 Agent」的路线，迅速发表了一篇长文回应。

Harrison Chase 认为，并非要通过严格的「二元论」来区分 Agent，目前我们看到大多数的「Agentic 系统」都是 Workflows 和 Agents 的结合。理想的 Agent 框架应该允许从「结构化工作流」逐步过渡到「由模型驱动」，并在两者之间灵活切换。

相比 OpenAI 的文章，Harrison Chase 更认同 Anthropic 此前发布的如何构建高效 Agents 的文章，对于 Agent 的定义，Anthropic 提出了「Agentic 系统」的概念，并且把 Workflows 和 Agents 都看作是其不同表现形式。

总的来说， 这是大模型派（Big Model）和工作流派（Big Workflow）的又一次争锋， 前者认为每次模型升级都可能让精心设计的工作流瞬间过时，这种「苦涩的教训」让他们更倾向于构建通用型、结构最少的智能体系统。而以 LangGraph 为代表的后者，强调通过显式的代码、模块化的工作流来构建智能体系统。他们认为结构化的流程更可控、更易调试，也更适合复杂任务。

### TLDR

- 构建可靠的 Agentic 系统，其核心难点在于确保 LLM 在每一步都能拿到恰当的上下文信息。这既包括精准控制输入给 LLM 的具体内容，也包括执行正确的步骤来生成那些有用的内容。
- Agentic 系统包含 Workflows 和 Agents（以及介于两者之间的一切）。
- 市面上大多数的 Agentic 框架，既不是声明式也不是命令式的编排工具，而是提供了一套 Agent 封装能力的集合。
- Agent 封装可以使入门变得更加容易，但它们常常会把底层细节隐藏起来，反而增加了确保 LLM 在每一步都能获得恰当上下文的难度。
- 无论 Agentic 系统是大是小，是 Agents 主导还是 Workflows 驱动，它们都能从同一套通用的实用功能中获益。这些功能可以由框架提供，也可以完全自己从头搭建。
- 把 LangGraph 理解成一个编排框架（它同时提供了声明式和命令式的 API），然后在它之上构建了一系列 Agent 封装，这样想是最恰当的。

  

**Founder Park 正在搭建开发者社群，邀请积极尝试、测试新模型、新技术的开发者、创业者们加入，请扫码详细填写你的产品/项目信息，通过审核后工作人员会拉你入群～**

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/qpAK9iaV2O3snzkdspY3sicygHZq6mUDiawBGVDggLGW3LyiaR21JwIMYzNR5EiaonkcSSic9pPovibSibHGxm6GveRBEQ/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp)

进群之后，你有机会得到：

- 高浓度的主流模型（如 DeepSeek 等）开发交流；
- 资源对接，与 API、云厂商、模型厂商直接交流反馈的机会；
- 好用、有趣的产品/案例，Founder Park 会主动做宣传。

---

  

OpenAI 最近发布了一篇关于构建 Agents 的指南，其中包含一些误导性的观点，比如下面这段：

> ### 声明式 vs 非声明式
> 
> 某些框架采用 **声明式** 方式，要求开发者在工作流设计之初，就通过图结构明确定义所有的分支、循环与条件。图中的结构通常由\*\*节点（代理） **与** 边（确定性或动态的任务传递）\*\*组成。虽然这种方式在可视化表达上更清晰，但随着工作流的动态性和复杂度不断增加，声明式方法容易变得繁琐，并且常常需要学习专门的领域特定语言，增加了开发门槛。
> 
> 相较之下， **Agents SDK** 提供了一种更为灵活的 **代码优先** 方案。开发者可以通过熟悉的编程结构直接表达工作流逻辑，无需提前预定义整个图结构，从而实现更加 **动态、可扩展的代理编排** 能力。

看到这段话，我最初是有点火大的。但写着写着我就明白了：认真思考 Agent 框架这件事本身就很复杂！市面上大概有上百种 Agent 框架，衡量它们的维度太多了，而且有时候这些维度还会被混在一起（就像这段引用里那样）。这里面充斥着大量的炒作、故作姿态和噪音。关于 Agent 框架，真正精确的分析和思考反而很少见。所以，这篇博客就是我们在这方面做的一次尝试。

在接下来的文章内容里，我参考了以下几份资料：

- OpenAI 的构建 Agents 指南（说实话，我觉得写得不太行）： https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
- Anthropic 的构建高效 Agents 指南（这篇我非常喜欢）： https://www.anthropic.com/engineering/building-effective-agents?ref=blog.langchain.dev
- LangGraph（这是我们自己用来构建可靠 Agents 的框架）： https://www.langchain.com/langgraph

## 01

## 什么是 Agent

## 构建难点在哪里？

这部分会提供一些基础信息，帮助大家更好地理解后续内容。

#### 什么是 Agent

目前，Agent 没有一个统一的或大家公认的定义，不同的人常常从不同的角度来定义它。

OpenAI 更倾向于从一个比较高屋建瓴、偏思想引领的角度来定义 Agent。

> Agents 是那些能代表你独立完成任务的系统。

说实话，我个人不太喜欢这个说法。这太笼统了，并不能帮我真正搞清楚 Agent 到底是个什么东西。这种说法太务虚，一点都不实用。

对比一下 Anthropic 的定义：

> 「Agent」 可以有几种不同的定义。有些客户把 Agent 看作是完全自主的系统，能长时间独立运行，用各种工具完成复杂的任务。另一些客户则用这个词来指代那些更遵循既定规则的实现，它们按照预设的 Workflows 来走。在 Anthropic，我们把所有这些变体都归类为 Agentic 系统，但在架构上，我们明确区分 Workflows 和 Agents：
> 
> Workflows 是通过预先写好的代码路径来协调 LLMs 和工具工作的系统。
> 
> 而 Agents 则是由 LLMs 自己动态地决定流程和工具使用，它们掌控着任务完成的方式。

我更喜欢 Anthropic 的定义，原因如下：

他们对 Agent 的定义要精确得多，也更技术化。

他们提到了「Agentic 系统」这个概念，并且把 Workflows 和 Agents 都看作是它的不同表现形式。这一点我非常赞同。

> **💡 我们在实际生产环境中看到的「Agentic 系统」，几乎都是「Workflows」和「Agents」的混合体。**

Anthropic 博客文章的后半部分给 Agents 的定义是，「… 通常只是 LLMs 在一个循环里基于环境反馈来使用工具。」

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/qpAK9iaV2O3tsq3kQmPkeiaxnjVGboYFic6xR6y46RV1XoRAKs5R8q6gKW4hR6z0vlZrNZt42YCL4Dib4XqwORH30Q/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

尽管 OpenAI 开头给 Agent 下了一个非常宏大的定义，但他们实际所指，基本上和 Anthropic 这个说法差不多。

这类 Agent 的配置项（参数）主要包括：

- 要使用的模型
- 要遵循的指令（System Prompt）
- 可以使用的工具

你的程序会在一个循环里调用模型。如果/当模型决定要调用某个工具时，你就运行那个工具，得到一些观察结果或反馈，然后把这些信息再传回给 LLM。这个过程会一直持续，直到 LLM 自己决定不再调用工具（或者它调用的某个工具触发了停止条件）。

OpenAI 和 Anthropic 都明确指出，Workflows 是一种与 Agents 不同的设计模式。在 Workflows 里，LLM 的控制权相对较弱，流程更倾向于确定性，这是一个非常有用的区分点。

OpenAI 和 Anthropic 都明确提到，用户/客户并非总是需要 Agents。在很多情况下，Workflows 更简单、更可靠、成本更低、速度更快，而且性能更好。这里引用自自 Anthropic 的文章：

> 在使用 LLMs 构建应用时，我们建议先从最简单的方案入手，只在确实需要时才增加复杂性。这可能意味着你根本不需要构建 Agentic 系统。Agentic 系统通常会牺牲一些延迟和成本，来换取更好的任务表现，你应该仔细权衡这种取舍是否划算。
> 
> 当确实需要更高复杂度时，Workflows 在处理界定清晰的任务时，能提供更好的可预测性和一致性；而当需要在规模化场景下实现灵活性和模型驱动的决策时，Agents 则是更好的选择。

OpenAI 的说法也差不多：

> 在你决定投入精力构建 Agent 之前，请先确认你的用例是否明确符合这些标准。否则，用确定性方案可能就足够了。

实际情况是，我们看到大多数的「Agentic 系统」都是 Workflows 和 Agents 的结合。这也就是为什么我们不太喜欢纠结于某个东西「是不是」一个 Agent，而更倾向于讨论一个系统「有多 Agentic」。这里特别感谢 Andrew Ng 提供了这种思考方式：

> 与其简单以二元的方式去判断某个东西是不是 Agent，我觉得更有意义的是去思考一个系统「在多大程度上像 Agent」。「Agentic」这个形容词，不像「Agent」这个名词那样非黑即白，它允许我们去审视所有这类系统，并将它们都包含在这个不断发展的领域中。

#### 构建 Agents 的难点在哪里？

我想大多数人都会认同，构建 Agents 是件难事，更准确地说构建一个 Agents 的原型很容易，但要搭一个可靠的、能支撑公司关键业务的应用才是难点。

最麻烦的部分在于让 Agents 应用「使其可靠」。目前，很容易就能做出一个在 Twitter 上看起来不错的 demo。但要让 Agents 去驱动一个对业务至关重要的应用，没有大量工作是做不到的。

几个月前，我们对 Agent 开发者们做了一项调查，问他们：「在将更多 Agents 投入生产时，你们遇到的最大障碍是什么？」 毫无疑问，排名第一的回答是「performance quality」。让 Agents 稳定可靠地工作，依然是个巨大的挑战。

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

那是什么原因导致 Agents 有时候表现不佳呢？是因为背后的 LLM 出错。

**为什么 LLM 会出错？主要有两个原因：**

一是模型本身能力还不够；

二是传递给模型的上下文信息不对或者不完整。

根据我们的经验，第二种情况非常常见。那又是什么导致上下文信息传递出问题呢？

- System Message 不完整或写得太短
- 用户的输入太模糊
- 没有给 LLM 提供正确的工具
- 工具的描述写得不好
- 没有传入恰当的上下文信息
- 工具返回的响应格式不对

> 💡 要构建一套可靠的 Agentic 系统，真正的挑战在于如何确保 LLM 在每一步都能拿到最合适的上下文信息。这包含了两方面：一是精准控制到底把哪些具体内容喂给 LLM，二是执行正确的步骤来生成那些有用的内容。

在我们讨论 Agent 框架的时候，记住这一点非常有帮助。任何让我们难以精确控制到底把什么传给 LLM 的框架，都只会碍事。把正确的上下文传给 LLM 本身就已经够难了，为什么还要让我们更难呢？

#### 那，什么是 LangGraph？

> 💡 可以将 LangGraph 理解成一个编排框架（它同时提供了声明式和命令式的 API），然后在它之上构建了一系列 Agent 封装。

LangGraph 是一个由事件驱动的框架，专门用来构建 Agentic 系统。使用 LangGraph 最常见的方式主要有两种：

- 一种是通过声明式的、基于图（Graph）的语法
- 另一种是利用构建在底层框架之上的 Agent 封装

此外，LangGraph 还支持函数式 API 以及底层的事件驱动 API，并提供了 Python 和 Typescript 两个版本。

Agentic 系统可以用节点（nodes）和边（edges）来表示。节点代表一个工作单元，而边则表示流程的转换。节点和边本身就是普通的 Python 或 TypeScript 代码，所以虽然图的结构是用声明式的方式来表示的，但图内部的逻辑运行起来是完全正常的命令式代码。边可以是固定的，也可以是条件式的。因此，图的整体结构是声明式的，但实际运行时的路径则可以完全动态。

LangGraph 内置了一个持久化层，这使得 **其具备容错能力、短期记忆以及长期记忆** 。

这个持久化层还支持「人工参与决策」（human-in-the-loop）和「人工监督流程」（human-on-the-loop）的模式，比如中断、批准、恢复以及时间回溯（time travel）等功能。

LangGraph 内建支持多种流式传输，包括 tokens 的流式输出、节点状态的更新和任意事件的流式推送。同时，LangGraph 可以与 LangSmith 无缝集成，方便进行调试、评估和可观测性分析。

  

**02**

**Agentic 框架都有哪些类型？**

#### Workflows vs Agents

大多数框架都提供了一些更高级别的 Agent 封装，有些框架也会为常见的 Workflows 提供一些封装。LangGraph 是一个用于构建 Agentic 系统的低层编排框架。它支持 Workflows、Agents，以及介于两者之间的任何形态。我们认为这一点至关重要。正如前面提到的，生产环境中大多数的 Agentic 系统都是 Workflows 和 Agents 的组合。一个成熟的生产级框架必须同时支持这两种模式。

我们回想一下构建可靠 Agents 的难点，即 **要确保 LLM 拿到正确的上下文** 。Workflows 之所以有用，部分原因就在于它们能够将正确的上下文传递给给 LLMs ，可以精确地决定数据如何流动。

当考虑要在 「workflow」 到 「agent」 的范围内构建应用程序时，需要考虑两件事：

- 可预测性（Predictability） vs 自主性（agency）
- 低门槛（low floor），高上限（high ceiling）

#### 可预测性（Predictability） vs 自主性（agency）

当系统越偏向 Agentic，其可预测性就会越低。 有时候，你希望或需要你的系统具有可预测性，这可能是出于用户信任、合规要求或其他原因。可靠性并不等同于可预测性，但在实践中，它们可能密切相关。

你希望你的应用在这个曲线上处于什么位置，这非常取决于具体的应用场景。LangGraph 可以用来构建处于这个曲线任何位置的应用，允许你自由地将系统调整到你想要的状态。

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**高门槛（High floor）， 低上限（low ceiling ）**

在思考框架时，考虑它们的「门槛」和「上限」是很有帮助的：

- 低门槛（Low floor）：一个低门槛的框架对新手友好，容易上手。
- 高门槛（High floor）：一个高门槛的框架意味着学习曲线陡峭，需要大量的知识或专业经验才能有效使用。
- 低上限（Low ceiling）：一个低上限的框架意味着它的能力有限，你能用它完成的事情不多（很快就会觉得不够用）。
- 高上限（High ceiling）：一个高上限的框架提供了广泛的能力和灵活性，能支持高级用例（它能和你一起成长）。

Workflow 框架提供了高上限，但门槛也高，但需要自己编写很多 Agent 的逻辑。

Agent 框架则是低门槛，但上限也低——虽然容易上手，但不足以应对复杂的用例。

LangGraph 的目标是兼具低门槛（提供内置的 Agent 封装，方便快速启动）和高上限（提供低层功能，支持实现高级用例）。

#### Declarative vs non-declarative（声明式与命令式）

声明式框架有其优势，也有劣势。这是程序员之间一个似乎永无止境的争论，每个人都有自己的偏好。

当人们说「非声明式」时，通常隐含的意思是它的替代方案是命令式（imperative）。

大多数人可能会把 LangGraph 描述成一个声明式框架。但这只说对了一部分。

首先，虽然节点和边之间的连接是通过声明式方式定义的，但实际的节点和边本身不过是 Python 或 TypeScript 函数。所以，LangGraph 其实是声明式和命令式的一种混合。

其次，除了我们推荐的声明式 API，我们实际上还支持其他 API。具体来说，我们支持函数式 API 和事件驱动 API。虽然我们认为声明式 API 是一个很有用的思考模型，但我们也认识到它并非适用于所有人。

人们对 LangGraph 的一个常见评价是，它就像 Tensorflow（一个声明式深度学习框架），而像 Agents SDK 这样的框架则像 Pytorch（一个命令式深度学习框架）。

这个说法是完全错误的。像 Agents SDK（以及早期的 LangChain， CrewAI 等）这样的框架，既不是声明式的也不是命令式的，它们只是封装。它们提供一个 Agent 封装（一个 Python 类），这个类里面封装了很多用于运行 Agent 的内部逻辑。它们算不上真正的编排框架，仅仅是一种封装。

#### Agent 封装（Abstractions）

大多数 Agent 框架都包含 Agent 封装。它们通常开始时是一个类，里面包含了 prompt、model 和 tools。然后陆续增加一些参数，最后，你就会看到一大堆参数，它们控制着多种多样的行为，所有这些都封装在一个类后面。如果你想看看里面到底发生了什么，或者想修改逻辑，就得深入到这个类里去改源代码。

> 💡 这些封装最终会让你非常非常难以理解或控制到底在每一步传递给 LLM 的具体内容是什么。这一点非常重要，拥有这种控制能力对于构建可靠的 Agents 至关重要（正如前面讨论的那样）。这就是 Agent 封装的危险之处。

我们是吃过亏才学到的这一点。这正是早期 LangChain 中 chains 和 agents 的问题所在。 **它们提供的封装反而成了障碍** 。两年前的那些早期封装中，有一个 Agent 类就接收 model、prompt 和 tools。这个概念并不新鲜，但当时它没有提供足够的控制权，现在也一样。

需要明确的是，这些 Agent 封装确实有其价值。它们让入门变得更容易。但我认为这些 Agent 封装还不足以构建可靠的 Agents（也许永远都不能）。

我们认为，看待这些 Agent 封装最好的方式，就像看待 Keras 一样。它们提供了更高层的封装，能够让使用者更容易上手。但关键在于，要确保它们是构建在更低层框架之上的，这样你才不会很快就遇到瓶颈，被它限制住。

这也就是为什么我们在 LangGraph 之上构建了 Agent 封装。它提供了一个轻松上手 Agents 的方式，但当你需要时，可以随时「转换」到更底层的 LangGraph 功能。

#### Multi Agent

通常情况下，Agentic 系统不会只包含一个 Agent，而是会包含多个。OpenAI 在他们的报告中提到：

> 对于许多复杂的 Workflows 来说，将提示和工具分散到多个 Agents 中有助于提高性能和可扩展性。当你的 Agents 未能遵循复杂的指令或持续选择错误的工具时，你可能需要进一步拆分系统，引入更多分工明确的 Agents。

**多 Agent 系统的关键在于它们如何通信。同样，构建 Agents 的难点也在于把正确的上下文信息传递给 LLMs。Agents 之间的通信因此非常重要。**

有很多种方法可以实现这一点。「Handoffs」（交接）就是其中一种方式，这是 Agents SDK 中的一个 Agent 封装，我个人还挺喜欢的。

但有时候，这些 Agents 之间最好的通讯方式是 Workflows。想象一下 Anthropic 博客文章里的那些 Workflow 图示，把里面的 LLM 调用替换成 Agents。这种 Workflows 和 Agents 的混合模式，往往能带来最好的可靠性。

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

同样，Agentic 系统不仅仅是 Workflows，也不仅仅是 Agent。它们是两者的结合。正如 Anthropic 在他们的博客文章中指出的那样：

> 组合和定制这些模式
> 
> 这些构建模块并非一成不变的指令。它们是开发者可以根据不同的用例进行调整和组合的常见模式。

  

**03**

**Agent 框架到底有什么价值？**

在定义并探讨了评估框架时应关注的不同维度后，现在让我们来解答一些常见问题。

我们经常看到有人质疑构建 Agentic 系统是否需要框架。那么，Agent 框架到底能提供哪些价值呢？

框架的通用价值在于它们提供了一些实用的封装，这些封装让上手变得容易，并为工程师提供了一种统一的构建方式，从而方便新人加入和项目维护。正如上面提到的，Agent 封装也有明显的缺点。对大多数 Agent 框架而言，这几乎是它们提供的唯一价值。我们努力确保 LangGraph 不会出现这种情况。

##### Short term memory 短期记忆

如今大多数 Agentic 应用都包含某种多轮对话（比如聊天）组件。LangGraph 提供了生产级别的存储能力，支持实现多轮对话体验（Threads）。

##### Long term memory 长期记忆

虽然还在早期阶段，但我非常看好 Agentic 系统从自身经验中学习的能力（比如跨对话记忆信息）。LangGraph 为跨 Thread 的长期记忆提供了生产级别的存储支持。

##### Human-in-the-loop 人机协同

很多 Agentic 系统通过引入一些 Human-in-the-loop 组件会变得更好。例如，从用户那里获取反馈、批准某个工具调用，或者修改工具调用的参数。LangGraph 内置支持在生产系统中实现这些 Workflows。

##### Human-on-the-loop 人工监督

除了允许用户在 Agent 运行时参与之外，允许用户在 Agent 运行结束后检查它的运行轨迹，甚至可以回到之前的步骤，然后从那里（做些修改后）重新运行也很重要。我们称之为 Human-on-the-loop，LangGraph 内置提供了相关支持。

##### Streaming 流传输

大多数 Agentic 应用运行需要一些时间，因此向最终用户提供实时更新对于提供良好的用户体验来讲至关重要。LangGraph 内置支持 tokens、图的步骤以及任意流的流式传输。

##### Debugging/observability 调试/可观测性

构建可靠 Agents 的难点在于确保向 LLM 传递了正确的上下文，能够检查 Agent 执行的每一个精确步骤，以及每一步的精确输入/输出，这对于构建可靠的 Agents 至关重要。LangGraph 与 LangSmith 无缝集成，能够提供一流的调试和可观测性能力。注意：AI 的可观测性与传统软件的可观测性不同（这值得专门写一篇文章讨论）。

##### Fault tolerance 容错

容错是构建分布式应用的传统框架（如 Temporal）的关键组成部分。LangGraph 通过持久化 Workflow 和可配置的重试机制，使容错变得更容易。

##### Optimization 优化

与其手动调整 Prompt，有时候定义一个评估数据集，然后基于数据集自动优化 Agent 可能更容易。LangGraph 目前没有「开箱即用」地支持这一点，我们认为现在还为时尚早。但我想提到这一点，因为它是一个值得考虑的有趣维度，也是我们一直在关注的方向。 DSPY 是目前在这个领域做得最好的框架。

> 💡 所有这些价值主张（除了 Agent 封装之外），对于 Agents、Workflows 以及介于两者之间的任何形态都提供了价值。

**那么，你真的需要一个 Agentic 框架吗？**

如果你的应用不需要所有这些功能，并且/或者你愿意自己去构建它们，那么你可能就不需要框架。其中一些功能（比如 Short term memory）并不是特别复杂。但另一些功能（比如 Human-on-the-loop，或 LLM 特定的可观测性）则更为复杂。

关于 Agent 封装，我认同 Anthropic 在他们文章中的说法：

> 如果你确实使用了框架，请确保你理解其底层的代码。对底层机制的错误假设是导致客户错误的一个常见原因。

  

**04**

LLMs 越来越厉害

都会变成 Agents 而不是 Workflows？

关于 Agents（相较于 Workflows）的一个常见论点是：虽然它们现在可能还不够好用，但将来会变得更好，到那时，你只需要那些简单的、能够调用工具的 Agents 就够了。

我认为以下几点可能都是事实：

- 这些能够调用工具的 Agents 的性能继续提升
- 能够控制输入给 LLM 的内容依然会非常重要（垃圾进，垃圾出）
- 对于一些应用来说，简单的工具调用循环可能就足够了
- 对于另一些应用来说，Workflows 就是更简单、更便宜、更快、也更好的
- 对于大多数应用来说，生产环境中的 Agentic 系统将是 Workflows 和 Agents 的结合。

我不认为 OpenAI 或 Anthropic 会反对以上任何一点，来看 Anthropic 文章中的说法：

> 在使用 LLMs 构建应用时，我们建议先从最简单的方案入手，只在确实需要时才增加复杂性。这可能意味着你根本不需要构建 Agentic 系统。Agentic 系统通常会牺牲一些延迟和成本，来换取更好的任务表现，你应该仔细权衡这种取舍是否划算。

以及 OpenAI 文章中的说法：

> 在你决定投入精力构建 Agent 之前，请先确认你的用例是否明确符合这些标准。否则，确定性方案可能就足够了。

是否一类应用，简单的工具调用循环就足够了呢？我认为，这可能只在你使用的是一个针对你的特定用例、用大量数据训练/微调/通过强化学习优化的模型时，才有可能实现。这种情况可以通过两种方式发生：

- 你的任务是独一无二的。你收集大量数据，并自己训练/微调/通过强化学习优化模型。
- 你的任务并非独一无二。大型模型实验室正在用代表你的任务的数据进行训练/微调/通过强化学习优化。

（题外话：如果我正在一个垂直领域创业，而我的任务并非独一无二，我会非常担心我公司的长期生存能力。)

#### 你的任务是独一无二

我敢打赌，大多数用例（尤其是大多数企业级用例）都属于这一类。AirBnb 处理客户支持的方式，与 Klarna 处理客户支持的方式不同，也与 Rakuten 处理客户支持的方式不同。这些任务中存在大量的微妙之处。一家在客户支持领域领先的 Agent 公司「Sierra」，他们构建的不是一个单一的客户支持 Agent，而是一个客户支持 Agent 平台：

> Sierra Agent SDK 让开发者能够使用一种声明式的编程语言，通过可组合的技能来表达流程性知识，从而构建强大灵活的 Agents。

他们之所以需要这样做，是因为每家公司的客户支持体验都足够独特，以至于一个通用 Agent 无法达到所需的性能。

举一个使用针对特定任务训练的模型、采用简单工具调用循环的 Agent 的例子：OpenAI 的 Deep Research。所以这是可以做到的，并且可以做出令人惊叹的 Agents。

如果你能针对你的特定任务训练一个 SOTA 模型，那么是的，你可能确实不需要一个支持任意 Workflow 的框架，你只需要一个简单的工具调用循环就够了。在这种情况下，Agents 将优于 Workflows。

在我看来，一个非常开放的问题是：有多少 Agent 公司拥有数据、工具或知识来为他们的任务训练一个 SOTA 模型？目前，我认为只有大型模型实验室能够做到这一点。但这种情况会改变吗？一家小的垂直创业公司能否为其任务训练一个 SOTA 模型？我对这个问题非常感兴趣。如果你目前正在做这件事，请务必联系我们。

#### 你的任务并非独一无二

我认为有些任务足够通用，以至于大型模型实验室能够提供足够好的模型，来处理这些非通用任务中的简单工具调用循环。

OpenAI 通过 API 发布了他们的 Computer Use 模型，这是一个针对通用计算机使用数据微调的模型，目标是让它在那个通用任务上表现足够好。（题外话：我认为它离足够好还差得远）。

Code 是一个有趣的例子。编程相对来说比较通用，而且代码无疑是 Agent 迄今为止一个突出的用例。Claude code 和 OpenAI 的 Codex CLI 是两个代码 Agents 的例子，它们都使用了简单的工具调用循环。我强烈认为，基础模型在训练时使用了大量的编程数据和任务。

（Anthropic 的官网文档中证明了他们是这样做： https://docs.anthropic.com/en/docs/build-with-claude/tool-use/text-editor-tool?ref=blog.langchain.dev）。

有趣的是，当通用模型用这些数据训练时，这些数据的确切形态有多重要？Ben Hylak 前几天发了一条很有意思的推文，似乎引起了很多人的共鸣：

> 模型现在不知道怎么用 Cursor 了。
> 
> 它们都被优化去适配终端了。这就是为什么 3.7 和 o3 在 Cursor 里表现糟糕，但在外面又很厉害的原因。

这可能暗示着两件事：

你的任务必须非常非常接近通用模型训练时使用的任务。你的任务与训练任务相似度越低，通用模型对你的用例来说可能就越不够好。

用其他特定任务的数据来训练通用模型，可能会降低它在你任务上的性能。我相信，与 Cursor 用例相似的数据，用于训练新模型的量即使不多，也和终端数据一样多。但如果新加入的这些数据形态稍微有点不同，它就会压倒其他类型的数据。这意味着目前通用模型很难在大量任务上都表现得非常出色。

> 💡 即使对于那些 Agents 比类似 Workflow 的方案更受青睐的应用来说，你仍然会从框架中那些与低层 Workflow 控制无关的功能中受益：比如 Short term memory 存储、Long term memory 存储、Human-in-the-loop、Human-on-the-loop、Streaming、Fault tolerance、Debugging/observability。

  

**05**

OpenAI 的观点哪里不对？

如果我们回顾一下 OpenAI 的观点，会发现它建立在一些错误的二分法之上，混淆了「Agentic 框架」的不同维度，从而夸大了他们单一封装的价值。具体来说，它混淆了「声明式 vs 命令式」与「Agent 封装」，以及「Workflows vs Agents」。

> 💡 归根结底，它没有抓住构建生产级 Agentic 系统的主要挑战，也没有认清框架应该提供的核心价值，即一个可靠的编排层，它能让开发者明确控制 LLMs 接收到的上下文信息，同时无缝处理持久化、容错、Human-in-the-loop 交互等生产环境的关键问题。

让我们逐条分析他们观点中我认为有问题的地方：

**「声明式 vs 非声明式」**

LangGraph并不是完全声明式的——但它足够声明式，所以这并不是我主要想吐槽的点。我主要想吐槽的是，「非声明式」这个说法用得太随意了，而且容易误导。通常大家批评声明式框架时，更偏爱命令式框架。但 Agents SDK 并非命令式框架，它是一种封装的概念。一个更恰当的标题应该是「声明式 vs 命令式」、「你需要一个编排框架吗」、「为什么你只需要 Agent 封装」或者「Workflows vs Agents」，这取决于他们真正想论证什么（他们似乎想在下面同时论证这些）。

**「随着 Workflows 变得越来越动态和复杂，这种方法会迅速变得笨拙和具有挑战性」 。**

这跟声明式还是非声明式一点关系都没有，它完全是关于 Workflows vs Agents 的问题。你完全可以用声明式的图来表达 Agents SDK 中的 Agent 逻辑，而且这个图的动态性和灵活性，和 Agents SDK 本身是一样的。

再说到 Workflows vs Agents。很多 Workflows 并不需要更高程度的动态性和复杂性。OpenAI 和 Anthropic 也都认同这一点。能用 Workflows 的时候就应该用 Workflows。大多数 Agentic 系统都是两者的结合。是的，如果一个 Workflow 真的非常动态和复杂，那就用 Agent。但不要什么都用 Agent。OpenAI 自己在这篇文章前面就说过这一点。

**「通常需要学习专门的领域特定语言」**

同样，Agents SDK 不是一个命令式框架，它是一种封装的概念。Agents SDK 有自己的领域特定语言（就是它的封装）。我认为，目前阶段，学习和使用 Agents SDK 的封装，比学习 LangGraph 的封装更麻烦。很大程度上是因为构建可靠 Agents 的难点在于确保 Agent 有正确的上下文，而 Agents SDK 在这方面对开发者的遮蔽程度，比 LangGraph 要严重得多。

**「更灵活」**

这个说法绝对不属实，恰恰相反。你能用 Agents SDK 做到的任何事，用 LangGraph 都能做到。Agents SDK 能做到的，可能只占 LangGraph 能力的 10%。

**「代码优先」**

使用 Agents SDK，你写的是他们定义好的封装。使用 LangGraph，你写的是大量的普通代码。我看不出 Agents SDK 怎么就「代码优先」了。

**「使用熟悉的编程结构」**

使用 Agents SDK，你得学习一整套全新的封装。使用 LangGraph，可以编写大量的普通代码。还有什么比这更熟悉的编程结构吗？

**「实现更动态和适应性强的 Agent 编排」**

同样，这跟声明式还是非声明式无关，这是 Workflows vs Agents 的问题。参考上面的观点。

  

**06**

各种 Agent 框架之间该怎么比较？

我们讨论了很多 Agent 框架的不同构成要素：

- 它们是一个灵活的编排层，还是仅仅是一个 Agent 封装？
- 如果它们是一个灵活的编排层，是声明式的还是其他的形式？
- 除了 Agent 封装之外，这个框架还提供了哪些功能？

我觉得把这些维度整理到一张电子表格里会很有意思。我尽量做到公正客观。

目前这张表比较了 Agents SDK， Google 的 ADK， LangChain， Crew AI， LlamaIndex， Agno AI， Mastra， Pydantic AI， AutoGen， Temporal， SmolAgents， DSPy。

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

在线链接：https://docs.google.com/spreadsheets/d/1B37VxTBuGLeTSPVWtz7UMsCdtXrqV5hCjWkbHN8tfAo/edit?ref=blog.langchain.dev&gid=0#gid=0

  

参考来源：

https://blog.langchain.dev/how-to-think-about-agent-frameworks/

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg5NTc0MjgwMw==&mid=2247498686&idx=1&sn=73438da0762cdc2b2f77097a24804dfb&scene=21#wechat_redirect)

转载原创文章请添加微信：founderparker

继续滑动看下一个

Founder Park

向上滑动看下一个