<template>
  <div style="width: 100; padding: 10px">
    <p>
      <van-icon name="shop-o" color="#007acc" />{{ info.buildingNumber }}
    </p>
    <van-empty description="暂无数据" v-if="unitInfo.length === 0" />
    <CommunityInfo v-for="item in unitInfo" :key="item.unitId" :info="item" />
  </div>
</template>

<script>
import { findUnitInfoByBuindingReq } from "../../../../utils/api";
import CommunityInfo from "./CommunityInfo";
export default {
  name: "CommunityBuildingInfo",
  props: ["info"],
  components: {
    CommunityInfo,
  },
  data() {
    return {
      unitInfo: [],
    };
  },
  created() {
    this.loadUnitInfo();
  },
  methods: {
    loadUnitInfo() {
      findUnitInfoByBuindingReq({ buindingId: this.info.id }).then((res) => {
        this.unitInfo = res.data;
      });
    },
  },
};
</script>

<style>
</style>