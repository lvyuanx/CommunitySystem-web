<template>
  <div class="box roleBox">
    <van-dialog v-model="show" title="权限范围" @close="close">
      <van-row class="roleBox">
        <van-checkbox-group v-model="result" direction="horizontal">
          <van-col span="12" v-for="item in roleResource" :key="item.parentId">
            <span>{{item.periodName}}</span>
          </van-col>
        </van-checkbox-group>
      </van-row>
    </van-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      require: false,
      default: false,
    },
    roleResource: {
      type: Array,
      require: false,
      defalut: [],
    }
  },
  name: 'RoleResourceTab',
  data() {
    return {
      show: false,
      result: []
    };
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newValue, oldVale) {
        this.show = newValue
      }
    },
    roleResource: {
      immediate: true,
      handler() {
        console.log(this.roleResource)
        if (this.roleResource.length > 0) {
          this.roleResource.forEach(element => {
            this.result.push(element.parentId)
          });
        }
      }
    }
  },
  methods: {
    close() { // 关闭弹窗
      this.$bus.$emit("changeRoleResourcePopuShow", false) //使用自定义事件传递数据
    }
  }
}
</script>

<style scoped>
.roleBox {
  padding: 10px;
  height: 200px;
  overflow: auto;
}
.itemBox {
  margin-top: 10px;
}
</style>