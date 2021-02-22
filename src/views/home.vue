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
    <connection class="component" :isLeaveMassage="state.isLeaveMassage"></connection>
<!--    <chat class="component"></chat>-->
<!--    TODO: 暂时不使用动态组件，报警告，要求要用非响应式，有强迫症暂时不用-->
<!--    <component class="component"-->
<!--               :isLeaveMassage="state.isLeaveMassage"-->
<!--               :is="comps.compsName"></component>-->
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch, reactive } from "vue";
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

// 聊天
const chatInfo = reactive({
  charSocket: null,
  url: 'wss://wst.fivehills.com/wss/', // socket url
  apiKey: 'alpha',
  serviceInfo: {}, // 客服信息
  charLog: [],  // 聊天记录
  random: '', // 10位随机值
  isConnect: false, // 连接客服是否成功
  isServiceMsg: false,  // 已显示客服回复的默认信息
})

// 根据路由变化，出发赋值
watch(router, () => {
  changeComps();
  if(state.userInfo.name&&state.userInfo.phone) {
    websocketHandle();
  }
})
// 处理信息和留言
function changeComps() {
  const { name, phone, email } = router.query
  state.userInfo.name = name || '';
  state.userInfo.phone = phone || '';
  state.userInfo.email = email || '';
  if (!chatInfo.isConnect && name && phone) {
    state.isLeaveMassage = true;
    state.header = '给我的留言';
  } else {
    state.isLeaveMassage = false;
    state.header = '正在连接客服...';
  }
}
function getId() {
  return Date.now() + Math.random().toString().substr(2, 10)
}
//
function websocketHandle() {
  const params = chatInfo.apiKey + `&${state.userInfo.name}&` + chatInfo.random;
  console.log(chatInfo.url + params, '888', state.userInfo.name);
  chatInfo.charSocket = new WebsocketHeartbeatJs({
    url: chatInfo.url + params,
    pingTimeout: 20000,
    pongTimeout: 20000,
    pingMsg: `{"from": "${params}", "sys": "CPT", "to":"client"}`
  })
  chatInfo.charSocket.onreconnect = () => {
    console.log('charSocket reconnecting...')
  }
  chatInfo.charSocket.onerror = () => {
    console.log('charSocket onerror...')
  }
  chatInfo.charSocket.onclose = () => {
    console.log('charSocket onerror...')
  }
  chatInfo.charSocket.onmessage = ({data}) => {
    let obj = {
      data: {
        online_service: []
      }
    }
    try {
      obj = JSON.parse(data)
    } catch (e) {
      console.log('格式化错误')
    }
    if (obj.code === undefined) return
    // 首次连接
    if (obj.code === 0) {
      if (obj.data.online_service && obj.data.online_service.length > 0) {
        chatInfo.isConnect = true
        chatInfo.serviceInfo = obj.data.online_service[0]
        if (chatInfo.isServiceMsg) return
        chatInfo.isServiceMsg = true
        chatInfo.charLog.push({
          id: getId(),
          time: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
          text: obj.data.greeting,
          isUser: false,
          status: 0
        })
        
      } else {
        chatInfo.isShowChar = false
        chatInfo.serviceInfo = {}
      }
      return
    }
    // 发送成功
    if (obj.code === 2 && obj.data.data === 'replyCodeConfirm') {
      // 将对应的loading状态修改
      const index = chatInfo.charLog.findIndex(item => item.id === obj.data.msgId)
      if (index < 0) return
      setTimeout(() => {
        chatInfo.charLog[index].status = 0
      }, 100)
      return
    }
    // 客服回复
    if (obj.code === 2) {
      const time = new Date(obj.data.time).getTime() + 8 * 60 * 60 * 1000
      const isImg = /^data:image/.test(obj.data.data)
      chatInfo.charLog.push({
        type: isImg ? 'image' : 'text',
        id: chatInfo.getId(),
        time: dateFormat("YYYY-mm-dd HH:MM:SS", new Date(time)),
        text: isImg ? obj.data.image : obj.data.data,
        isUser: false,
        status: 0
      })
      // chatInfo.$nextTick(_ => {
      //   chatInfo.getDom('charLog').scrollTo(0, this.getDom('charLog').scrollHeight)
      // })
      return
    }
    // 心跳更新客服列表
    if (obj.code === 3) {
      if (obj.data.online_service && obj.data.online_service.length > 0) {
        chatInfo.isShowChar = true
        chatInfo.serviceInfo = obj.data.online_service[0]
      } else {
        chatInfo.isShowChar = false
        chatInfo.serviceInfo = {}
      }
    }
  }
}


onMounted(() => {
  chatInfo.random = localStorage.getItem('random') ? localStorage.getItem('random') : Math.random().toString().substr(2, 10)
  localStorage.setItem('random', chatInfo.random)
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
