import 'element-plus/lib/theme-chalk/index.css';

import {
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus';

const components = [
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
]

const plugins = [
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
]
//  按需引入
export default function (app) {
  [...components, ...plugins].forEach(item => {
  app.use(item)
})
}
