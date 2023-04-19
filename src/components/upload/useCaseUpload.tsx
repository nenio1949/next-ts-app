/*
 * @Description:用例上传 不用上传到7牛云
 * @Author: wll
 * @Date: 2023/1/13 4:13 下午
 */
import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import CustomItem from '@/components/upload/customItem'

interface IProps {
  useCaseFileList: Array<UploadFile>
  setUseCaseFileList: (files: Array<UploadFile>) => void
  onChange?: (files: Array<UploadFile> | null) => void
  isPreview?: boolean
}

const UseCaseUpload = (props: IProps) => {
  const { useCaseFileList, setUseCaseFileList, onChange, isPreview = true }: IProps = props
  const uploadProps: UploadProps = {
    fileList: useCaseFileList,
    accept: '.docx',
    maxCount: 1,
    onRemove: (file) => {
      const index = useCaseFileList.indexOf(file)
      const newFileList = useCaseFileList.slice()
      newFileList.splice(index, 1)
      setUseCaseFileList(newFileList)
      if (onChange) {
        onChange(newFileList.length ? newFileList : null)
      }
    },
    itemRender: (originNode, file, _fileList, actions) => {
      return <>{isPreview ? <CustomItem file={file} remove={actions.remove} /> : originNode}</>
    },
    beforeUpload: (file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setUseCaseFileList([file])
        if (onChange) {
          onChange([file])
        }
      }
      return false
    }
  }
  return (
    <>
      <Upload.Dragger maxCount={1} {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件至此区域上传</p>
        <p className="ant-upload-hint">{'支持扩展名：.docx'}</p>
      </Upload.Dragger>
    </>
  )
}

export default UseCaseUpload
