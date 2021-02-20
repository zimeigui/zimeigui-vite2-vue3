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
    <component class="component"
               :is="comps.compsName"></component>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch, reactive } from "vue";
import { useRoute } from 'vue-router';
// 会话前，预留信息
import connection from 'components/connection.vue';
import { dateFormat } from 'common/util';
// 聊天页面
// import chat from 'components/chat.vue';
// 客服不在线，留言
import leaveMassage from 'components/leaveMassage.vue';

const router = useRoute();

const comps = ref({
  compsName: connection
})
const state = reactive({
  header: '基本资料',
  // 客户信息
  userInfo: {
    phone: '',
    name: '',
    email: '',
  },
  isShowChat: false, // 在线聊天或留言
})
// 根据路由变化，出发赋值
watch(router, () => {
  changeComps();
})

function changeComps() {
  const { name, phone, email } = router.query
  state.userInfo.name = name || '';
  state.userInfo.phone = phone || '';
  state.userInfo.email = email || '';
  if (!state.userInfo.name) {
    comps.value.compsName = connection // 会话前，预留信息
  } else {
    comps.value.compsName = leaveMassage // 客服不在线，留言
  }
}

onMounted(() => {
  changeComps()
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
