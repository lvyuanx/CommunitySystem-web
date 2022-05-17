<template>
  <div class="box">
    <!-- <van-cell center :title="recordInfo.temperature + '℃'" value="" clickable :label="recordInfo.createTime" /> -->
    <van-cell :value="recordInfo.createTime" :icon="icon">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">{{recordInfo.temperature + '℃'}}</span>
        <van-tag :type="type">{{isHealth}}</van-tag>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  props: {
    recordInfo: {
      type: Object,//类型
      required: true,//必要性
      default: 0 //默认值
    },
    active: {
      type: Number,//类型
      required: false,//必要性
      default: 0 //默认值
    }
  },
  name: 'RecordItem',
  data() {
    return {
      type: 'danger',
      icon: 'success',
    }
  },
  computed: {
    isHealth() {
      if (this.recordInfo.temperature > 37.5) {
        this.type = 'danger'
        return '异常'
      } else {
        this.type = 'success'
        return '健康'
      }
    }
  },
  watch: {
    recordInfo: {
      deep: true, // 深度监视
      immediate: true, //初始化时让handler调用一下
      handler() {
        if (this.recordInfo.isEnable == 0) {
          this.icon = 'cross'
        } else {
          this.icon = 'success'
        }
      }
    }
  }
}
</script>

<style scoped>
.itemBox {
  background-color: white;
  margin-top: 3px;
}
.custom-title {
  margin-right: 8px;
  vertical-align: middle;
}
</style>