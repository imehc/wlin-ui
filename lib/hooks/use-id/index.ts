/** 定义一个立即执行的函数表达式（IIFE），用于创建一个全局唯一的ID生成器 */
export const useId = (() => {
  // 初始化一个计数器变量，用于生成ID
  let counter = 0;
  // 返回一个函数，每次调用该函数时，计数器自增并返回新的值，从而生成全局唯一的ID
  return () => counter++;
})();

export { useId as generateUniqueId }
