<template>
  <div>
    <van-popup v-model="show" round position="bottom" @close="closePoup">
      <van-cascader v-model="cascaderValue" title="请选择家庭住址" :options="options" @close="show = false" @finish="onFinish" />
    </van-popup>
  </div>
</template>

<script>
import { findAllCommunityInfoReq } from '../../../utils/api'
export default {
  name: "SelectAddress",
  props: {
    isShow: {
      type: Boolean,
      require: false,
      default: false,
    },
    userId: {
      type: String,
      require: false,
      defalut: "",
    }
  },
  data() {
    return {
      show: false,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
    }
  },
  watch: {
    show: {
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        if (newValue) {
          this.findAll();
        }
      }
    },
    isShow: {
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.show = newValue
      }
    },
  },
  methods: {
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.show = false;
      let selId = selectedOptions[selectedOptions.length - 1].value
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      let path = this.fieldValue
      this.$dialog.confirm({
        title: "选择完成",
        message: "是否确定绑定：" + this.fieldValue,
      }).then(() => {
        let params = {
          userId: this.userId,
          householdId: selId,
          selectedOptions: selectedOptions
        }
        this.$bus.$emit("changeAddress", params)

      }).catch(() => {
      })
    },
    findAll() { // 查询社区信息
      findAllCommunityInfoReq().then((r2) => {
        this.options = r2.data;
      });
    },
    closePoup() {
      this.$bus.$emit("changeShow", false) //使用自定义事件传递数据
    }
  }
}
</script>

<style>
</style>