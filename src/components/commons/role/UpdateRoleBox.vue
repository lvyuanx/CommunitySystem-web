<template>
  <div class="box">
    <van-action-sheet v-model="show" title="权限范围" @close="close" cancel-text="取消" @cancel="onCancel">
      <van-row type="flex" justify="center">
        <van-col span="20" class="roleListBox">
          <van-row>
            <van-checkbox-group v-model="result" direction="horizontal">
              <van-col span="12" v-for="item in periodList" :key="item.periodId">
                <van-checkbox class="itemBox" shape="square" :name="item.periodId">{{item.periodNumber}}</van-checkbox>
              </van-col>
            </van-checkbox-group>
          </van-row>
        </van-col>
      </van-row>
    </van-action-sheet>
  </div>
</template>

<script>
import { findAllCommunityInfoReq } from '../../../utils/api'

export default {
  props: {
    isShow: {
      type: Boolean,
      require: false,
      default: false,
    },
    periodIds: {
      type: Object,
      require: false,
      defalut: [],
    }
  },
  name: 'updateRoleBox',
  data() {
    return {
      show: false,
      periodList: [],
      result: [],
      resultNameStr: '',
      isOnCancel: false,
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newValue, oldVale) {
        this.show = newValue
      }
    },
    periodIds: {
      immediate: false,
      handler() {
        if (this.periodIds.periodIds.length > 0) {
          this.periodIds.periodIds.forEach(item => this.result.push(item))
        }
      }
    },
    result: {
      immediate: false,
      handler() {
        let periodNumberList = []
        let _this = this
        this.periodList.filter(item => _this.result.indexOf(item.periodId) != -1)
          .forEach(item => periodNumberList.push(item.periodNumber))
        this.resultNameStr = periodNumberList.join(",")
      }
    }
  },
  mounted() {
    this.findAllCommunityInfo()
  },
  methods: {
    onCancel() {
      this.isOnCancel = true
    },
    close() { // 关闭弹窗
      this.$bus.$emit("closeUpdateRoleBox", {
        isShow: false,
        result: this.result,
        resultNameStr: this.resultNameStr,
        isOnCancel: this.isOnCancel
      })
      if (!this.isOnCancel) {
        this.result = []
        this.resultNameStr = ''
      }
    },
    findAllCommunityInfo() { // 查询所有的期
      findAllCommunityInfoReq().then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            let period = {
              periodId: item.value,
              periodNumber: item.text,
            }
            this.periodList.push(period)
          })
        } else {
          this.$toast("获取权限信息失败")
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped>
.roleListBox {
  height: 350px;
  overflow: auto;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 15px;
}
.itemBox {
  margin-top: 10px;
}
</style>