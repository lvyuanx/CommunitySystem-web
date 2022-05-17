<template>
  <div style="width: 100%">
    <div class="col-12 m-0 p-0">
      <NavTopBar title="个人详情" :leftArrow="true" :rightArrow="true" />
    </div>
    <van-cell-group inset title="基础信息">
      <van-cell title="头像">
        <van-image scale-down width="100" height="100" :src="userInfo.avatar" />
      </van-cell>
      <van-cell title="社区身份" :value="userInfo.duties" />
      <van-cell title="登录名" :value="userInfo.loginName" />
      <van-cell title="真实姓名" :value="userInfo.realName === null ? '请完善信息' : userInfo.realName" />
      <van-cell title="昵称" :value="userInfo.nickName === null ? '请完善信息' : userInfo.nickName" />
      <van-cell title="性别" :value="userInfo.sex == 1 ? '男':'女'" />
    </van-cell-group>
    <van-cell-group inset title="隐私信息">
      <van-cell title="手机号码" :value="userInfo.mobil" />
      <van-cell title="固定电话" :value="userInfo.tel === null ? '请完善信息' : userInfo.tel" />
      <van-cell title="电子邮箱" :value="userInfo.email === null ? '请完善信息' : userInfo.email" />
      <van-cell title="家庭地址" :value="userInfo.address === null ? '请完善信息' : userInfo.address" />
    </van-cell-group>
    <van-cell-group v-if="isShow" inset title="社区信息">
      <van-cell title="期" :value="address.periodNumber" />
      <van-cell title="栋" :value="address.buildingNumber" />
      <van-cell title="单元" :value="address.unitNumber" />
      <van-cell title="层" :value="address.layerNumber" />
      <van-cell title="户" :value="address.householdNumber" />
    </van-cell-group>
  </div>
</template>

<script>
import { loginInfoReq, getImageReq, findInfoByUserReq } from "../../../../utils/api";
import NavTopBar from '../../../commons/NavTopBar'
export default {
  name: "userInfo",
  data() {
    return {
      userInfo: {},
      isShow: false,
      address: {
        periodNumber: '',
        buildingNumber: '',
        unitNumber: '',
        layerNumber: '',
        householdNumber: ''
      }
    };
  },
  components: {
    NavTopBar
  },
  created() {
    loginInfoReq().then((req) => {
      this.userInfo = req.data;
      let avatar;
      if (req.data.avatar != null && req.data.avatar.trim() != '') {
        avatar = req.data.avatar;
        getImageReq(
          {
            path: avatar,
          },
          {}
        ).then((r) => {
          this.userInfo.avatar = window.URL.createObjectURL(r);
        });
      } else {
        this.userInfo.avatar = "/img/default/defaultHead.png"
      }

    });
    this.findInfoByUser();
  },
  methods: {
    findInfoByUser() {
      findInfoByUserReq().then(res => {
        if (res.data == null) {
          this.isShow = false
        } else {
          this.isShow = true
          this.address = res.data
        }
      })
    }
  },
};
</script>

<style>
</style>