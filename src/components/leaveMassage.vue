<!--
 * @Author: 阿紫
 * @Date: 2021-02-04 17:08:57
 * @LastEditTime: 2021-02-04 17:11:05
 * @LastEditors: LastEditors
 * @Description: 客服不在线，留言
 * @FilePath: /vite-project/src/components/leaveMassage.vue
-->

<template>
  <div class="leaveMassage">
    {{ state.name }}
  </div>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  name: 'leaveMassage',
});
</script>
<style lang='scss'>
.leaveMassage {
}
</style>