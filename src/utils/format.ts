/*
 * @Description:格式化工具类
 * @Author: yong.li
 * @Date: 2023-03-06 14:39:11
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 17:38:50
 */

import dayjs from 'dayjs'

// 时间格式化
const date = (time: string | number | Date | dayjs.Dayjs | null | undefined, type?: string) => {
  if (time) {
    if (type) {
      return dayjs(time).format(type)
    } else {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  } else {
    return time || '/'
  }
}

const format = {
  date
}

export default format
