/*
 * @Description: 菜单数据
 * @Author: yong.li
 * @Date: 2022-02-07 10:33:43
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-20 10:55:37
 */

import {
  ProjectOutlined,
  DatabaseOutlined,
  InsertRowAboveOutlined,
  ToolOutlined,
  RobotOutlined,
  SettingOutlined,
  TabletOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { MenuProps } from 'antd'

const menuData: MenuProps['items'] = [
  {
    key: '/',
    label: '首页',
    icon: <BarChartOutlined />
  },
  {
    key: '/useCase',
    label: '基础用例库管理',
    icon: <DatabaseOutlined />
  },
  {
    key: 'test-table-template',
    label: '测试表格模板管理',
    icon: <InsertRowAboveOutlined />
  },
  {
    key: 'test-sequence-template',
    label: '测试序列模板管理',
    icon: <TabletOutlined />
  },
  {
    key: 'laboratory-test',
    label: '实验室测试',
    icon: <ProjectOutlined />,
    children: [
      {
        key: 'laboratory-test_use-case',
        label: '用例管理'
      },
      {
        key: 'laboratory-test_project-version',
        label: '数据统计'
      },
      {
        key: 'laboratory-test_test-table',
        label: '测试表格管理'
      },
      {
        key: 'laboratory-test_test-report',
        label: '测试报告管理'
      },
      {
        key: 'laboratory-test_combine-investigation',
        label: '实验室综合联调'
      }
    ]
  },
  {
    key: 'spot-test',
    label: '现场测试',
    icon: <ToolOutlined />,
    children: [
      {
        key: 'spot-test_use-case',
        label: '用例管理'
      },
      {
        key: 'spot-test_project-version',
        label: '数据统计'
      },
      {
        key: 'spot-test_test-table',
        label: '测试表格管理'
      },
      {
        key: 'spot-test_combine-investigation',
        label: '现场综合联调'
      },
      {
        key: 'spot-test_test-sequence',
        label: '测试序列管理'
      }
    ]
  },
  {
    key: 'defect',
    label: '缺陷管理',
    icon: <RobotOutlined />,
    children: [
      {
        key: 'defect_confirm-test',
        label: '确认测试缺陷管理'
      },
      {
        key: 'defect_comprehensive',
        label: '综合联调缺陷管理'
      },
      {
        key: 'defect_shared',
        label: '项目共享缺陷'
      }
    ]
  },
  {
    key: 'statistics',
    label: '数据统计',
    icon: <PieChartOutlined />,
    children: [
      {
        key: 'statistics_day-count',
        label: '日测试量统计'
      },
      {
        key: 'statistics_test-result-count',
        label: '项目测试结果统计'
      },
      {
        key: 'statistics_defect-count',
        label: '项目缺陷统计'
      }
    ]
  },
  {
    key: 'console',
    label: '控制台',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'console_setting-auth',
        label: '权限配置'
      },
      {
        key: 'console_setting-project-person',
        label: '项目人员配置'
      },
      {
        key: 'console_setting-project',
        label: '项目可见范围设置'
      },
      {
        key: 'console_setting-message',
        label: '模版变更通知配置'
      }
    ]
  }
]

export default menuData
