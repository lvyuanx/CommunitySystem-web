<template>
  <div class="box exceptionInfoBox">
    <van-swipe-cell class="box cellBox">
      <van-row class="rowBox">
        <van-col span="8 imageBox" :style="{'background-image': 'url(' + avatarUrl + ')'}">
        </van-col>
        <van-col span="16">
          <ul>
            <li><strong>{{exceptionInfo.userName}}</strong> {{exceptionInfo.userMobile}}</li>
            <li>异常类型：<span class="typeBox" :style="typeBoxStyle">{{exceptionTypeName}}</span></li>
            <li>异常描述：</li>
            <li><a href="#" @click="showDescription()" class="aStyle">{{simpleExceptionDescription}}</a></li>
          </ul>
        </van-col>
      </van-row>
      <template #right>
        <van-button square type="primary" @click="updateStatus(exceptionInfo.id, 1)" class="cell-button" text="处理" />
        <van-button square type="danger" @click="endExec()" class="cell-button" text="结束" />
      </template>
    </van-swipe-cell>
    <van-action-sheet style="min-height:50%" v-model="show" title="异常详情">
      <div class="content">
        <p><strong>创建时间：</strong>{{exceptionInfo.createTime}}</p>
        <p><strong>异常描述：</strong></p>
        <p style="text-indent:2em;">{{exceptionInfo.exceptionDescription}}</p>
      </div>
    </van-action-sheet>

    <van-dialog v-model="showEndTab" title="处理结果" show-cancel-button :before-close="beforeClose" @confirm="confirm(exceptionInfo.id)">
      <van-field v-model="result" rows="4" autosize label="处理结果" type="textarea" maxlength="150" placeholder="请输入结果" show-word-limit />
    </van-dialog>
  </div>
</template>

<script>
import { updateStatusReq, getImageReq } from '../../../../utils/api'
export default {
  props: {
    exceptionInfo: {
      type: Object,//类型
      required: true,//必要性
      default: 0 //默认值
    }
  },
  name: 'NotStarted',
  data() {
    return {
      show: false,
      showEndTab: false,
      result: '',
      avatarUrl: '/img/default/defaultHead.png'
    }
  },
  mounted() {
    this.createUrl()
  },
  computed: {
    exceptionTypeName() {
      return this.exceptionInfo.exceptionType == 0 ? '体温异常' : '其它异常'
    },
    typeBoxStyle() {
      let infoStyel = {
        backgroundColor: "#0066cc"
      }
      let dangerStyle = {
        backgroundColor: "#FF0033"
      }
      return this.exceptionInfo.exceptionType == 0 ? dangerStyle : infoStyel
    },
    simpleExceptionDescription() {
      let simple = '';
      if (this.exceptionInfo.exceptionDescription.length > 10) {
        simple = this.exceptionInfo.exceptionDescription.substr(0, 25) + '... [详情]'
      } else {
        simple = this.exceptionInfo.exceptionDescription + " [详情]"
      }
      return simple;
    }
  },
  methods: {
    createUrl() {
      if (this.exceptionInfo.userAvatar == null || this.exceptionInfo.userAvatar.trim() == '') {
        return;
      }
      getImageReq(
        {
          path: this.exceptionInfo.userAvatar
        },
        {}
      ).then((r) => {
        this.avatarUrl = window.URL.createObjectURL(r);
      });
    },
    onSearch(val) {

    },
    showDescription(desc) {
      this.show = true;
    },
    updateStatus(id, status, result) {
      let params = {
        id: id,
        status: status,
        result: result
      }
      updateStatusReq(params).then(res => {
        this.result = ''
        if (res.code == 200) {
          this.$toast.success("操作成功")
          this.$bus.$emit("changeList", id) //使用自定义事件传递数据
        } else {
          this.$toast(res.message)
        }
      })
    },
    endExec() {
      this.showEndTab = true
    },
    confirm(id) {
      if (this.result.trim().length > 0) {
        this.updateStatus(id, 2, this.result);
      }
    },
    beforeClose(action, done) {
      if (action == 'confirm' && this.result.trim().length <= 0) {
        this.$toast("请输入处理结果！")
        done(false)
      } else {
        done()
      }
    }
  }
}
</script>

<style scoped>
.exceptionInfoBox {
  margin-top: 3px;
  background-color: white;
}
.cell-button {
  height: 100%;
}
.cellBox {
  height: 120px;
}
.rowBox {
  min-height: 120px;
}
.imageBox {
  display: inline-block;
  vertical-align: top;
  width: 110px; /* 容器必须设置宽高 */
  height: 110px;
  background-size: cover;
  background-position: center center;
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 5px;
}
li {
  font-size: 14px;
  margin-bottom: 2px;
}
ul {
  padding: 5px;
}
.typeBox {
  color: white;
  border-radius: 5px;
  padding: 3px;
}
.aStyle {
  color: #666666;
  font-size: 13px;
}
.content {
  padding: 16px 16px 160px;
}
</style>