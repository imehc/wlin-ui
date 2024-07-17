import { useCallback, useState } from 'react';
import Cookies from 'js-cookie';

/**
 * 使用Cookie的钩子。
 * 
 * 该钩子提供了获取、设置和删除指定Cookie的能力。
 * 
 * @param cookieName Cookie的名称。
 * @returns 返回一个数组，包含当前Cookie的值、更新Cookie值的函数和删除Cookie的函数。
 */
export const useCookie = (
  cookieName: string
): [string | null, (newValue: string, options?: Cookies.CookieAttributes) => void, () => void] => {
  // 使用useState钩子来管理Cookie的值。如果Cookie不存在，则值为null。
  const [value, setValue] = useState<string | null>(() => Cookies.get(cookieName) || null);

  // 使用useCallback钩子来创建一个更新Cookie值的函数，并确保其引用不变。
  const updateCookie = useCallback(
    (newValue: string, options?: Cookies.CookieAttributes) => {
      // 设置新的Cookie值，并同步更新useState中的值。
      Cookies.set(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName]
  );

  // 使用useCallback钩子来创建一个删除Cookie的函数，并确保其引用不变。
  const deleteCookie = useCallback(() => {
    // 删除Cookie，并将useState中的值设置为null。
    Cookies.remove(cookieName);
    setValue(null);
  }, [cookieName]);

  // 返回当前Cookie的值、更新函数和删除函数。
  return [value, updateCookie, deleteCookie];
};
