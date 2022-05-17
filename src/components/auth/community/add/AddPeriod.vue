<template>
  <div style="width: 100%">
    <van-row>
      <van-col span="24">
        <van-cell center :title="title">
          <template #right-icon>
            <van-switch v-model="checked" size="24" />
          </template>
        </van-cell>
      </van-col>
    </van-row>
    <van-form @submit="onSubmit" style="margin-top: 10px">
      <van-field v-if="checked"
        name="期"
        label="期"
        placeholder="请填写期名"
        v-model="period.periodNumber"
        :rules="[
          { pattern: pattern, message: '期名格式错误(支持中英文和数字)' },
        ]"
      />
      <van-field
        v-if="! checked"
        readonly
        clickable
        name="picker"
        :value="selValue"
        label="选择期名"
        placeholder="点击选择期名"
        @click="loadPicker"
      />

      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>


<script>
import { addReq, findReq } from "../../../../utils/api";

export default {
  name: "AddPeriod",
  data() {
    return {
      period: {
        periodNumber: "",
      },
      checked: true,
      pattern: /^(?:[\u4e00-\u9fa5A-Za-z0-9]{2,7})$/,
      selIndex: "",
      selValue: "",
      listData: [],
      columns: [],
      showPicker: false,
    };
  },
  computed: {
    title() {
      return this.checked ? "添加" : "挂载";
    },
  },
  mounted(){
      this.$bus.$emit("active", 0) //使用自定义事件传递数据
      this.$bus.$emit("title", "期") 
  },
  methods: {
    /**提交表单 */
    onSubmit() {
      if (this.checked) {
        // 添加
        addReq('period' ,{}, this.period).then((res) => {
          if (res.code === 200) {
            this.period = res.data;
            this.$dialog
              .confirm({
                message: "添加成功,是否进行下一步？",
              })
              .then(() => {
                // on confirm
                this.$router.replace({
                    name: 'addBuilding',
                    params: {
                        period: this.period
                    }
                })
              })
              .catch(() => {
                // on cancel
              });
          } else {
            this.$toast.fail(res.message);
          }
        });
      } else {
        // 挂载
        this.$router.replace({
            name: 'addBuilding',
            params: {
                period: this.listData[this.selIndex]
            }
        })
      }
    },
    /**选择期 */
    onConfirm(value, index) {
      this.selIndex = index;
      this.selValue = value
      this.showPicker = false;
    },
    /**加载选择期面板 */
    loadPicker(){
        this.showPicker = true
        this.columns.splice(0, this.columns.length)
        this.listData.splice(0, this.listData.length)
        findReq('period').then((res) => {
        if (res.code === 200) {
            res.data.forEach(item => {
                this.listData.push(item)
                this.columns.push(item.periodNumber)})
        } else {
            this.$toast.fail(res.message);
        }
        });
    }
  },
};
</script>

<style>
</style>