<template>
  <div class="connection">
    <div class="tips">
      欢迎您！为提高服务效率，请阁下在开始对话前提供一些基本资料
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="form"
      label-width="0"
      class="demo-ruleForm"
    >
      <el-form-item prop="name">
        <el-input v-model="ruleForm.name" placeholder="* 姓名"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input :maxlength="11" v-model="ruleForm.phone" placeholder="* 手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          开始会话
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref(null)

const  checkPhone = (rule, value, callback) => {
  if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(value) || !value) {
    callback(new Error('请输入11位正确的手机号'))
  } else {
    callback()
  }
}

const state = reactive({
  ruleForm: {
    phone: '',
    name: '',
    email: '',
  },
  rules: {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    phone: [
      { required: true, validator: checkPhone, trigger: 'blur' },
    ],
  }
});
const ruleForm = state.ruleForm, rules = state.rules;


function submitForm() {
  form.value.validate((valid) => {
    if (valid) {
      router.push({
        name: 'Home',
        query: {
          ...state.ruleForm
        }
      })
    }
  })
}

onMounted(() => {
  form.value && form.value.resetFields()
})
</script>
<style lang='scss'>
.connection {
 
 .tips {
   font-size: 14px;
   text-align: left;
   color: #666666;
   padding-bottom: 30px;
 }
  .el-form-item {
    margin-bottom: 40px;
  }
  .el-button {
    width: 100%;
    margin-top: 40px;
  }
}
</style>

