/*
 * @Description:校验工具类
 * @Author: yong.li
 * @Date: 2023-03-06 14:39:11
 * @LastEditors: yong.li
 * @LastEditTime: 2023-03-06 14:46:43
 */

/**
 * @author: yong.li
 * @description: 手机号校验
 * @param {string} mobile 手机号
 * @return {*} true|false
 */
const mobile = (mobile: string) => {
  return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/.test(
    mobile
  )
}

const validate = {
  mobile
}

export default validate
