---
category: Components
title: Calendar 日历 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 基础组件 # 所在分组的名称
  order: 1 # 分组排序，值越小越��前
---

# Calendar

## 介绍

基础的日历组件 Calendar。

## 示例 

<!-- 可以通过code加载示例代码，dumi会帮我们做解析 -->
<code src="../../examples/calendar/demo01.tsx">基础用法</code>
<code src="../../examples/calendar/demo02.tsx">定制日期显示</code>
<code src="../../examples/calendar/demo03.tsx">定制日期单元格</code>

## APi

<!-- 会生成api表格 -->
| 属性 | 类型                   | 默认值   | 必填 | 说明 |
| ---- | ---------------------- | -------- | ---- | ---- |
| locale | 'en-US', 'zh-CN' | undefined |  false  | 多语言 |
| dateRender | 'FunctionComponent' | undefined |  false  | 定制日期 |
| dateInnerContent | 'FunctionComponent' | undefined |  false  | 定制日期单元格 |
