import "element3/lib/theme-chalk/index.css";

import {
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
} from 'element3';

export default function (app) {
  //  按需引入
  app.use(ElCol)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElInput)
    .use(ElButton)

}
