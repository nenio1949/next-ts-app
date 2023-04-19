/*
 * @Description:自定义文件列表
 * @Author: wll
 * @Date: 2023/1/13 4:12 下午
 */
import { UploadFile } from 'antd'

interface IPorps {
  file: UploadFile
  remove?: (file: UploadFile) => void | boolean | Promise<void | boolean>
}

const CustomItem = (porps: IPorps) => {
  const { file, remove } = porps
  const prefix = '/show/preview-file?fileUrl='
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.open(file.url ? `${prefix}${file?.url}` : file.thumbUrl, '_blank')
  }
  return (
    <>
      <div className="ant-upload-list ant-upload-list-text">
        <div className="ant-upload-list-text-container">
          <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
            <div className="ant-upload-list-item-info">
              <span className="ant-upload-span">
                <div className="ant-upload-text-icon">
                  <span className="anticon anticon-paper-clip">
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="paper-clip"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      {/* eslint-disable-next-line max-len */}
                      <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z" />
                    </svg>
                  </span>
                </div>
                <a onClick={onClick} rel="noopener noreferrer" className="ant-upload-list-item-name" title={file?.name}>
                  {file?.name}
                </a>
                <span className="ant-upload-list-item-card-actions">
                  <button
                    onClick={() => {
                      remove && remove(file)
                    }}
                    title="删除文件"
                    type="button"
                    className="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn"
                  >
                    <span role="img" aria-label="delete" className="anticon anticon-delete">
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="delete"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {/* eslint-disable-next-line max-len */}
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                      </svg>
                    </span>
                  </button>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomItem
