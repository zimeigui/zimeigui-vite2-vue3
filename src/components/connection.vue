<template>
  <div class="connection">
    <div class="tips">
      {{ title }}
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="form"
      label-width="0"
      class="demo-ruleForm"
    >
      <el-form-item prop="name">
        <el-input :maxlength="10" v-model="ruleForm.name" placeholder="* 姓名"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input :maxlength="11" v-model="ruleForm.phone" placeholder="* 手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.email" placeholder="邮箱地址"></el-input>
      </el-form-item>
      <el-form-item prop="text" v-if="props.isLeaveMassage">
        <el-input placeholder="*留言内容" type="textarea" v-model="ruleForm.text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          {{ state.btnTitle }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, defineProps, watch, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
// 路由
const router = useRouter();
const route = useRoute();
const props = defineProps({
  isLeaveMassage: false
})

const form = ref(null)
const checkPhone = (rule, value, callback) => {
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
    text: '',
  },
  rules: {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    phone: [
      { required: true, validator: checkPhone, trigger: 'blur' },
    ],
    text: [
      { required: true, message: '请输入留言内容', trigger: 'blur' }
    ]
  },
  btnTitle: ''
});

const ruleForm = state.ruleForm, rules = state.rules;

const { phone, name, email } = route.query;

state.ruleForm.phone = phone;
state.ruleForm.name = name;
state.ruleForm.email = email;


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

const title = computed(() => {
  let value = '欢迎您！为提高服务效率，请阁下在开始对话前提供一些基本资料。';
  state.btnTitle = '开始会话';
  if (props.isLeaveMassage) {
    value = '抱歉，我们的客服人员目前离线。请留言，我们将会与您联系。';
    state.btnTitle = '留言';
  }
  return value
})

onMounted(() => {
  form.value && form.value.resetFields();
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

