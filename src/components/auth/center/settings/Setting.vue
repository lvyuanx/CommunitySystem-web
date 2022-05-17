<template>
  <div class="row m-0 p-0" style="width: 100%">
    <div class="col-12 m-0 p-0">
      <NavTopBar title="设置" :leftArrow="true" :rightArrow="true" />
    </div>
    <div class="col-12 m-0 p-0">
      <van-cell-group>
        <van-cell  value="缓存清理" is-link @click="cache" />
        <van-cell  value="关于我" is-link @click="isShow" />
        <van-cell  value="退出登录" is-link @click="logout" />
      </van-cell-group>
    </div>
    <div class="col-12 m-0 p-0">
      <van-popup class="father" v-model="show" round position="bottom" closeable :style="{ height: '30%' }" >
        <div class="row text-center">
          <p>社区健康疫情管理系统 V1.0.0 <br/><small class="text-secondary">让社区管理更加智能高效！</small></p>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>

import {logoutReq} from '../../../../utils/api'
import NavTopBar from '../../../commons/NavTopBar'

export default {
  name: "Setting",
  data(){
    return{
      show: false
    }
  },
  components: {
    NavTopBar
  },
  methods: {
    /**模拟清理缓存 */
    cache(){
      this.$toast.success("清理成功")
    },
    /**显示关于我弹出窗口 */
    isShow(){
      this.show = !this.show
    },
    /**退出登录 */
    logout(){
      let _this = this
      logoutReq().then(req => {
        if(req.code == 200){
          _this.$toast.success(req.message)
          _this.$router.replace({path: '/'})
        }else{
          _this.$toast.fail(req.message)
        }
      })
    }
  },
};
</script>

<style>

.father{
  display: flex;
  justify-content: center;/*实现水平居中*/
  align-items:center; /*实现垂直居中*/
}
</style>