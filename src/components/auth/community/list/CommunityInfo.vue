<template>
  <van-row class="box">
    <van-col span="24">
      <strong
        ><van-icon name="wap-home-o" color="#63bbfd" />
        {{ info.unitNumber }}</strong
      >
    </van-col>
    <van-col span="24">
      <van-grid icon-size="18px" clickable :column-num="2">
        <van-grid-item class="text-center">
          <van-icon name="apps-o" size="18px" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >总户数: {{ info.allHousehold }} 户</small
          >
        </van-grid-item>
        <van-grid-item class="text-center">
          <van-icon name="friends-o" size="18px" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >总人口: {{info.allUser}} 人</small
          >
        </van-grid-item>
        <!-- <van-grid-item class="text-center">
          <van-icon name="bar-chart-o" size="18px" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >危险等级:  {{info.dangerGrade}} </small
          >
        </van-grid-item> -->
        <van-grid-item class="text-center">
          <van-icon name="qr" size="18px" class="text-success" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >绿码数: {{info.greenCode}} 人</small
          >
        </van-grid-item>
        <van-grid-item class="text-center">
          <van-icon name="qr" size="18px" class="text-danger" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >红码数: {{info.redCode}} 人</small
          >
        </van-grid-item>
        <van-grid-item class="text-center">
          <van-icon name="qr" size="18px" class="text-warning" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >黄码数: {{info.yellowCode}} 人</small
          >
        </van-grid-item>
        <van-grid-item class="text-center">
          <van-icon name="qr" size="18px" class="text-secondary" /><small
            class="text-secondary"
            style="margin-top: 5px"
            >灰码数: {{info.greyCode}} 人</small
          >
        </van-grid-item>
      </van-grid>
    </van-col>
  </van-row>
</template>

<script>
export default {
  name: "CommunityInfo",
  props: ["info"],
};
</script>

<style scoped>
.box {
  margin: 6px;
  border-radius: 5px;
  padding: 10px;
  box-shadow: #ccc 2px 2px 5px;
}
</style>