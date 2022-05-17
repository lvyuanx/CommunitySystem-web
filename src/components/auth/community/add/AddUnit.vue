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
        name="单元"
        label="单元"
        placeholder="请填写单元的名称"
        v-model="unit.unitNumber"
        :rules="[
          { pattern: pattern, message: '格式错误(仅支持中英文和数字)' },
        ]"
      />
      
      <van-field
        v-if="! checked"
        readonly
        clickable
        name="picker"
        :value="selValue"
        label="选择单元名"
        placeholder="点击选择单元名"
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
  name: "AddUnit",
  data() {
    return {
      unit: {
        unitNumber: "",
        buildingId: this.$route.params.building.id
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
  created(){
      this.$bus.$emit("active", 2) //使用自定义事件传递数据
      this.$bus.$emit("title", "单元") 
  },
  computed: {
    title() {
      return this.checked ? "添加" : "挂载";
    },
  },
  methods: {
    /**提交表单 */
    onSubmit() {
      if (this.checked) {
        // 添加
        addReq('unit', {}, this.unit).then((res) => {
          if (res.code === 200) {
            this.unit = res.data;
            this.$dialog
              .confirm({
                message: "添加成功,是否进行下一步？",
              })
              .then(() => {
                // on confirm
                this.$router.replace({
                    name: 'layer',
                    params: {
                        unit: this.unit
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
            name: 'layer',
            params: {
                unit: this.listData[this.selIndex]
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
        findReq('unit', {parentId: this.$route.params.building.id}).then(res => {
        if (res.code === 200) {
            res.data.forEach(item => {
              this.listData.push(item)
              this.columns.push(item.unitNumber)})
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