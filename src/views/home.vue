/**
*  Created by  阿紫
*  On 2021/2/7
*  Content
*/

<template>
  <div class='home'>
    <div class="header">
      {{ state.header }}
    </div>
<!--    <chat v-if="chatInfo.isConnect"-->
<!--          :service-info="chatInfo.serviceInfo"-->
<!--          :api-key="chatInfo.apiKey"-->
<!--          :user-info="state.userInfo"-->
<!--          :char-log="chatInfo.charLog">-->
<!--    </chat>-->
    <chat v-if="true" :user-info="state.userInfo"></chat>
    <connection class="component" v-else :isLeaveMassage="state.isLeaveMassage"></connection>
    <!--    TODO: 暂时不使用动态组件，报警告，要求要用非响应式，有强迫症暂时不用-->
    <!--    <component class="component"-->
    <!--               :isLeaveMassage="state.isLeaveMassage"-->
    <!--               :is="comps.compsName"></component>-->
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch, reactive, watchEffect } from "vue";
import { useRoute } from 'vue-router';
import { dateFormat } from 'common/util';
// 会话前，预留信息
import connection from 'components/connection.vue';
// 聊天页面
import chat from 'components/chat.vue';
import WebsocketHeartbeatJs from "websocket-heartbeat-js";

const router = useRoute();

// const comps = reactive({
//   compsName: connection, // 动态组件
// })

// 基本信息
const state = reactive({
  header: '正在连接客服...',
  isLeaveMassage: false, // 是否处于留言状态
  // 客户信息
  userInfo: {
    phone: '',
    name: '',
    email: '',
  },
});

// 根据路由变化，出发赋值
watch(router, () => {
  changeComps();
})

// watchEffect(()=>{
//   if(chatInfo.isConnect) {
//     setHeader();
//   }
// })

// 处理信息和留言
function changeComps() {
  const { name, phone, email } = router.query
  state.userInfo.name = name || '';
  state.userInfo.phone = phone || '';
  state.userInfo.email = email || '';
  // if (state.userInfo.name && state.userInfo.phone) {
  //   websocketHandle();
  // }
  setHeader()
}
// 设置header
function setHeader () {
  // step1:没有信息-- 预留信息
  // step2: 有预留信息 + 连接 = 会话
  // step3: 有预留信息 + 没有连接 = 留言
  const { name, phone } = router.query
  if (name && phone) {
    // if (!chatInfo.isConnect) {
    //   state.isLeaveMassage = true;
    //   state.header = '给我的留言';
    // } else {
    //   state.isLeaveMassage = false;
    //   state.header = '与我们在线交谈';
    // }
  } else {
    state.isLeaveMassage = false;
    state.header = '正在连接客服...';
  }
}

onMounted(() => {
  changeComps();
})
</script>

<style lang='scss'>
.home {
  margin: 0 auto;
  background: #ffffff;
  border-radius: 4px;
  
  .header {
    width: 100%;
    line-height: 64px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    background-color: #44A4FF;
  }
  
  .component {
    margin: 0 auto;
    //height: 486px;
    padding: 24px 39px 0;
  }
}

</style>
