/**
*  Created by  阿紫
*  On 2021/2/4
*  Content 聊天页面
*/

<template>
  <div class='chat' @keydown.prevent.enter="sendMsg">
    <div class="content">
      <div class="char-log" ref="charLogPc">
        <div class="char-log-item"
             :class="item.isUser ? 'right' : 'left'"
             v-for="(item, index) in chatInfo.charLog" :key="index">
          <div class="time">
            {{ item.time }}
          </div>
          <div class="icon-div">
            <div v-if="item.type === 'image'" class="text">
              <img :src="item.text" alt=""/>
            </div>
            <div v-else v-html="item.text" class="text"></div>
            <svg-icon v-if="item.status === 1" name="loading" color="#44a4ff"></svg-icon>
            <svg-icon v-else-if="item.status === 2" name="error" color="#ff0000"></svg-icon>
          </div>
        </div>
      </div>
      <div class="input-div">
        <div class="icons">
          <!--<svg-icon name="emoji"></svg-icon>-->
          <svg-icon name="img" @click="clickUpload"></svg-icon>
        </div>
        <div class="text" contenteditable="true" ref="textPc"></div>
        <div class="handle-btn">
          <div class="btn send" role="button" @click="sendMsg">发送</div>
        </div>
      </div>
    
    </div>
    <div class="service">
      <img v-if="chatInfo.serviceInfo.headUrl" :src="chatInfo.serviceInfo.headUrl" alt=""/>
      <p>客服: {{ chatInfo.serviceInfo.nickName }}</p>
      <p>职位: {{ chatInfo.serviceInfo.position }}</p>
      <p>签名: {{ chatInfo.serviceInfo.content }}</p>
    </div>
    <input type="file" accept="image/*" @change="fileChange" style="display: none" ref="fileInput"/>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref, useContext, watch } from "vue";
import { dateFormat } from 'common/util';
import WebsocketHeartbeatJs from "websocket-heartbeat-js";

const ctx = useContext();

const props = defineProps({
  userInfo: {
    type: Object,
    default() {
      return {
        phone: '',
        name: '',
        email: '',
      }
    }
  }
})

// 聊天
const chatInfo = reactive({
  charSocket: null,
  url: 'wss://wst.fivehills.com/wss/', // socket url
  apiKey: 'alpha',
  serviceInfo: {}, // 客服信息
  charLog: [],  // 聊天记录
  random: '', // 10位随机值
  isConnect: null, // 连接客服是否成功
  isServiceMsg: false,  // 已显示客服回复的默认信息
})

watch(()=>chatInfo.isConnect,()=>{
  ctx.emit('getChatInfo', chatInfo.isConnect)
})

function getId() {
  return Date.now() + Math.random().toString().substr(2, 10)
}

function websocketHandle() {
  const params = chatInfo.apiKey + `&${props.userInfo.name}&` + chatInfo.random;
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
  chatInfo.charSocket.onmessage = ({ data }) => {
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
        chatInfo.isConnect = false
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
        chatInfo.isConnect = true
        chatInfo.serviceInfo = obj.data.online_service[0]
      } else {
        chatInfo.isConnect = false
        chatInfo.serviceInfo = {}
      }
    }
  }
}


const fileInput = ref(null);

function clickUpload() {
  fileInput.click()
}

// 发送图片
function fileChange() {
  const file = fileInput.files[0]
  const fileSize = file.size
  if (!/image/.test(file.type)) {
    // return this.$toast('请上传jpg/png格式文件')
  }
  if (fileSize > 1024 * 1024 * 5) {
    // return this.$toast('请上传2M以内的图片')
  }
  lrz(file).then((rst) => {
    socketSend('data:image/png', rst.base64)
  }).catch(() => {
    // 处理失败会执行
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const file_content = e.target.result
      socketSend('data:image/png', file_content)
    }
  })
}

// 发送socket
function socketSend(text, image) {
  const random = localStorage.getItem('random');
  const params = props.apiKey + `&${props.userInfo.name}&` + random
  if (!text.trim()) return
  const time = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
  const id = getId();
  const obj = {
    type: image ? 'image' : 'text',
    id,
    time,
    text: image || text,
    isUser: true,
    status: 1,
    callback() {
      // 超时判定为发送失败
      setTimeout(() => {
        if (this.status === 1) {
          this.status = 2
        }
      }, 5000)
    }
  }
  chatInfo.charLog.push(obj)
  obj.callback()
  // this.$nextTick(_ => {
  //   this.getDom('charLog').scrollTo(0, this.getDom('charLog').scrollHeight)
  //   this.getDom('text').innerHTML = ''
  // })
  this.charSocket.send(JSON.stringify({
    code: 2,
    data: {
      image: image,
      data: text,
      from: params,
      to: this.serviceInfo.email,
      email: props.userInfo.email || '',
      sys: "CPT",
      name: props.userInfo.name,
      active: 0,
      clientIp: window.IP,
      msgId: id
    }
  }))
}

// 发送聊天消息
function sendMsg() {
  socketSend()
}

onMounted(() => {
  chatInfo.random = localStorage.getItem('random') ? localStorage.getItem('random') : Math.random().toString().substr(2, 10)
  localStorage.setItem('random', chatInfo.random)
  websocketHandle();
})
</script>

<style lang='scss'>
.chat {
  box-sizing: border-box;
  width: 100%;
  height: 486px;
  display: flex;
  justify-content: center;
  
  .content {
    width: 445px;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fa;
    
    .char-log {
      width: 100%;
      height: 340px;
      box-sizing: border-box;
      padding: 50px 20px 10px;
      overflow-y: auto;
      display: flex;
      flex-flow: column;
      
      .char-log-item {
        margin-top: 20px;
        
        &:first-child {
          margin-top: 0;
        }
        
        .icon-div {
          position: relative;
          display: inline-block;
        }
        
        .icon-loading, .icon-error {
          position: absolute;
          left: -20px;
          top: 8px;
        }
        
        .time {
          font-size: 12px;
          font-family: PingFang, PingFang-SC;
          color: #999999;
          line-height: 24px;
        }
        
        .text {
          position: relative;
          word-break: break-all;
          border-radius: 4px;
          font-size: 14px;
          font-family: PingFang, PingFang-SC;
          text-align: left;
          color: #333333;
          line-height: 22px;
          padding: 5px 10px;
          position: relative;
          display: inline-block;
          
          &::after {
            content: '';
            display: block;
            position: absolute;
            z-index: 1;
            border: 7px solid transparent;
          }
          
          img {
            width: 100px;
            object-fit: contain;
            margin: 5px 0;
          }
        }
        
        &.left {
          margin-right: 20px;
          text-align: left;
          
          .text {
            background-color: #FFFFFF;
            
            &::after {
              border-right-color: #FFFFFF;
              top: 10px;
              left: -14px;
            }
            
            > p {
              margin: 0;
            }
          }
        }
        
        &.right {
          margin-left: 20px;
          text-align: right;
          
          .text {
            background-color: #a1e75a;
            
            &::after {
              border-left-color: #a1e75a;
              top: 10px;
              right: -14px;
            }
            
            img {
              display: block;
            }
          }
        }
      }
    }
    
    .input-div {
      width: 100%;
      height: 146px;
      box-sizing: border-box;
      border-top: 1px solid #e6e7e9;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      
      .icons {
        width: 100%;
        height: 30px;
        box-sizing: border-box;
        padding: 0 14px;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        
        .svg-icon {
          margin-right: 15px;
          color: #767676;
          cursor: pointer;
          
          &:hover, &:active {
            color: #424242;
          }
        }
        
        .icon-img {
          width: 1.2em;
          height: 1.2em;
        }
      }
      
      .text {
        width: 100%;
        flex: 1;
        box-sizing: border-box;
        padding: 10px;
        outline: none;
        overflow-y: auto;
      }
      
      .handle-btn {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
        
        .btn {
          width: 74px;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover, &:active {
            opacity: 0.7;
          }
          
          &.send {
            background-color: #449FF6;
            color: #FFFFFF;
          }
        }
      }
    }
  }
  
  .service {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: block;
      margin: 24px auto 0;
    }
    
    p {
      font-size: 14px;
      text-align: left;
      color: #666666;
    }
    
  }
}
</style>
