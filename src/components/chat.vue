/**
*  Created by  阿紫
*  On 2021/2/4
*  Content 聊天页面
*/

<template>
  <div class='chat'>
    {{ state.name }}
  </div>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  name: 'chat',
});
</script>

<style lang='scss'>
.chat{
}
</style>