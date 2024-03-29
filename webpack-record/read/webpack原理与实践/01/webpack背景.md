需要了解的几点就是：

1. webpack 是什么？
2. 为什么需要 webapck？
3. webpack 解决了什么问题？
4. webpack 和其他打包工具的差异点是什么？
5. 作为开发者，需要学习到什么程度才能说是真的了解 webpack？webpack 的打包原理会吗？
6. 在实际开发过程中，怎么利用 webpack 去做一些事情，比如提效，性能优化？
7. 一些基础的配置会吗？ plugin，loader，这些概念熟悉否？
8. 能不能使用 webpack 自己从 0 配置一个项目的打包呢？

webpack 是什么？ 它是一个模块化打包工具，通过”万物皆模块“的设计思想，实现了整改前端项目的模块化，在 webpack 的理念中，前端项目中的任何资源都可以作为一个模块，任何模块都可以经过 Loader 机制的处理，最终再打包到一起。

webpack 本身架构中有两个核心特性，分别是 Loader 机制和插件机制。

- Webpack 背景介绍：
  包括模块化所解决的问题、模块化标准的演进过程、ES Modules 标准规范。希望你通过这个模块，能够了解 Webpack 这类工具解决的到底是什么问题。

- Webpack 核心特性：
  包括基本特性、配置方式、工作模式、基本工作原理、Loader 机制、插件机制。希望你学习完这个模块，能够完全掌握 Webpack 的基本使用，理解 Webpack 打包过程和打包结果的工作原理，同时也能够自己开发 Webpack 的 Loader 和插件。

- Webpack 高阶内容：
  包括 Source Map、模块热替换（HMR）机制、Proxy、Webpack Dev Server 等周边技能的使用，以及 Tree-shaking、sideEffects、Code Spliting 等高级特性的实践，再有就是常用优化插件、三种 hash 的最佳实践、打包速度优化，以更于你能更熟练地使用 Webpack 的高级特性，为开发效率添砖加瓦。

- 其他同类优秀方案：
  Rollup、Parcel。希望通过这个模块的介绍，让你能够了解到一些 Webpack 同类的优秀方案，以及它们设计上的不同，这些都能够让你在工作中应对不同的项目、不同的需求时可以有更多的选择。-

## 背景

- stage1： 文件划分方式

原始“模块化”的实现方式完全依靠约定实现

- stage2： 命名空间方式
  解决了命名冲突的问题
- stage3：IIFE
  使用立即执行函数表达式（IIFE，Immediately-Invoked Function Expression）为模块提供私有空间。具体做法是将每个模块成员都放在一个立即执行函数所形成的私有作用域中，对于需要暴露给外部的成员，通过挂到全局对象上的方式实现，

这种方式带来了私有成员的概念，私有成员只能在模块成员内通过闭包的形式访问，这就解决了前面所提到的全局作用域污染和命名冲突的问题。

- stage4： IIFE 依赖参数
  在 IIFE 的基础之上，我们还可以利用 IIFE 参数作为依赖声明使用，这使得每一个模块之间的依赖关系变得更加明显。

- stage5： 模块加载的问题
  模块的加载。在这几种方式中虽然都解决了模块代码的组织问题，但模块加载的问题却被忽略了，我们都是通过 script 标签的方式直接在页面中引入的这些模块，这意味着模块的加载并不受代码的控制，时间久了维护起来会十分麻烦。试想一下，如果你的代码需要用到某个模块，如果 HTML 中忘记引入这个模块，又或是代码中移除了某个模块的使用，而 HTML 还忘记删除该模块的引用，都会引起很多问题和不必要的麻烦。

更为理想的方式应该是在页面中引入一个 JS 入口文件，其余用到的模块可以通过代码控制，按需加载进来。

### 模块规范

CommonJS： node 中的规范，约定一个文件就是一个模块，每个模块都有单独的作用域，通过 module.exports 导出成员，再通过 require 函数去加载模块

CommonJS 约定的是以同步的方式加载模块，因为 Node.js 执行机制是在启动时加载模块，执行过程中只是使用模块，所以这种方式不会有问题。`但是如果要在浏览器端使用同步的加载模式，就会引起大量的同步模式请求，导致应用运行效率低下`。

ES Modules

### 模块打包工具的出现

模块化可以帮助我们更好地解决复杂应用开发过程中的代码组织问题，但是随着模块化思想的引入，我们的前端应用又会产生了一些新的问题，比如：

首先，我们所使用的 ES Modules 模块系统本身就存在`环境兼容问题`。尽管现如今主流浏览器的最新版本都支持这一特性，但是目前还无法保证用户的浏览器使用情况。所以我们还需要解决兼容问题。
其次，模块化的方式划分出来的模块文件过多，而前端应用又运行在浏览器中，每一个文件都需要单独从服务器请求回来。零散的模块文件必然会导致浏览器的`频繁发送网络请求`，影响应用的工作效率。
最后，谈一下在实现 JS 模块化的基础上的发散。随着应用日益复杂，在前端应用开发过程中不仅仅只有 JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题。而且从宏观角度来看，这些文件也都应该看作前端应用中的一个模块，只不过这些模块的种类和用途跟 JavaScript 不同。

- 第一，它需要具备编译代码的能力，也就是将我们开发阶段编写的那些包含新特性的代码转换为能够兼容大多数环境的代码，解决我们所面临的环境兼容问题。

- 第二，能够将散落的模块再打包到一起，这样就解决了浏览器频繁请求模块文件的问题。这里需要注意，只是在开发阶段才需要模块化的文件划分，因为它能够帮我们更好地组织代码，到了实际运行阶段，这种划分就没有必要了。

- 第三，它需要支持不同种类的前端模块类型，也就是说可以将开发过程中涉及的样式、图片、字体等所有资源文件都作为模块使用，这样我们就拥有了一个统一的模块化方案，所有资源文件的加载都可以通过代码控制，与业务代码统一维护，更为合理。

### 总结

Webpack 官方的 Slogan 仍然是：A bundler for javascript and friends（一个 JavaScript 和周边的打包工具）。
Webpack 以模块化思想为核心，帮助开发者更好的管理整个前端工程。
