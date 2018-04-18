# src 目录结构

## entry

* 请手动在 webpack.config.js 里面配置入口

## module

* 建议按页面分一下模块, 然后把所有的模块都放在 module 文件夹下面, 每个模块可以包含自己的 css, 然后将模块配置到 webpack.config.js 的 entry 里面

## style

* 建议把项目通用的 css 都放在 style 文件夹里面
* 比如在 style/reset.css 里面存放通用的 reset 样式
* 在 style/const 里面存放通用的变量
* 在 style/extend 和 style/mixin 里面存放通用的 extend/mixin
* 在 style/\_.css 里面引入所有 abstract(即不会有实际代码生成的) 的样式, 包括 const/extend/mixin
* 然后在 style/base.css 里面引入 \_/reset, 以及项目其它的通用的样式
* 然后在每一个 entry js 文件里面引入 style/base.css 即可

## util

* 建议把项目通用的 js 都放在 util 文件夹里面
* 比如在 util/bootstrap.js 里面存放通用的引导程序, 详细解释见下文
* 在 util/ajax.js 里面存放项目通用的 ajax 处理
* 然后在 util/index.js 里面引入所有的 util js
* 然后在每个 entry js 文件里面引入 util/index.js 即可

## bootstrap

* bootstrap 在计算机里面是引导程序的意思, 用于初始化, 建议在这里做一些通用的初始化工作
  * 比如说引入各种 shim/polyfill 兼容文件
  * 比如引入项目其他的通用 js 文件

## component

* 建议把所有的组件都放在这个文件夹里面, 并统一在 component/index.js 里面引入所有的组件
* 然后在 util/bootstrap.js 里面引入 component/index.js
