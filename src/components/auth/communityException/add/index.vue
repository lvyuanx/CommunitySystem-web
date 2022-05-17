<template>
  <div class="box">
    <nav-top-bar title="异常上报" :leftArrow="true" :rightArrow="true" />
    <van-form @submit="onSubmit">
      <van-field name="radio" label="异常类型">
        <template #input>
          <van-radio-group v-model="exceptionType" direction="horizontal">
            <van-radio name="0">体温异常</van-radio>
            <van-radio name="1">其他异常</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-if="isShow" v-model="abnormalTemperature" name="异常体温" label="异常体温" placeholder="请输入异常体温" :rules="[{ required: true, message: '请输入异常体温' }]" />
      <van-field v-model="exceptionDescription" rows="2" autosize label="异常描述" type="textarea" maxlength="150" placeholder="请输入描述信息" show-word-limit />
      <div style="margin: 16px;">
        <van-button :disabled="disabled" round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
import NavTopBar from '../../../commons/NavTopBar.vue';
import { addExceptionReq } from '../../../../utils/api'
export default {
  components: { NavTopBar },
  name: "AddException",
  data() {
    return {
      exceptionType: '0',
      exceptionDescription: '',
      abnormalTemperature: '',
      disabled: false
    };
  },
  computed: {
    isShow() {
      return this.exceptionType == 0 ? true : false
    }
  },
  methods: {
    onSubmit(values) {
      let exceptionDescription = this.exceptionDescription
      if (this.abnormalTemperature != '') {
        exceptionDescription = "(异常体温：" + this.abnormalTemperature + ")" + this.exceptionDescription
      }
      let data = {
        isDealWith: 0, // 0表示未开始处理异常
        exceptionType: this.exceptionType,
        exceptionDescription: exceptionDescription
      }
      addExceptionReq({}, data).then(res => {
        if (res.code == 200) {
          this.$toast.success("操作成功")
          this.disabled = true
        } else {
          this.$toast.fail("操作异常")
        }
      })
    },
  },
}
</script>

<style>
</style>