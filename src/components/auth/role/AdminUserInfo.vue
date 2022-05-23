<template>
  <div class="box exceptionInfoBox">
    <van-swipe-cell class="box cellBox">
      <van-row class="rowBox ">
        <van-col span="8 imageBox " :style="{'background-image': 'url(' + avatarUrl + ')'}">
        </van-col>
        <van-col span="16 infoBox">
          <van-row class="lineBox">
            <van-col span="10">
              <strong>姓名：</strong>{{userInfo.user.realName}}
            </van-col>
            <van-col span="14">
              <strong>电话：</strong>{{userInfo.user.mobil}}
            </van-col>
          </van-row>
          <van-row class="lineBox">
            <van-col span="24">
              <strong>人员类型：</strong><span class="typeBox" :style="tabStyle">{{userInfo.roleTypeName}}</span>
            </van-col>
          </van-row>
          <van-row class="lineBox">
            <van-col span="24">
              <van-divider :style="{ marginTop: '3px', marginBottom: '0px', color: '#1989fa', borderColor: '#1989fa' }">角色功能</van-divider>
            </van-col>
            <van-col span="24">
              <van-tag style="margin:3px" type="primary" v-for="item in userInfo.user.roleVoList" :key="item.id">{{item.roleName}}</van-tag>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
      <template #right>
        <van-button square type="primary" class="cell-button" native-type="button" @click="editRole" text="编辑" />
      </template>
    </van-swipe-cell>

  </div>
</template>

<script>
import { getImageReq } from '../../../utils/api'

export default {
  props: {
    userInfo: {
      type: Object,//类型
      required: true,//必要性
      default: 0 //默认值
    }
  },
  name: 'AdminUserInfo',
  data() {
    return {
      changeCodeBox: false,
      radio: 'green',
      showSelectAddress: false,
      selectUserId: '',
      avatarUrl: '/img/default/defaultHead.png',
      tabStyle: {
        backgroundColor: '#fcc72d'
      },
      day: 0,
      qrCodeInfo: {
        codeType: '',
        codeTypeName: ''
      },
      roleTypeName: this.userInfo.roleTypeName,

    }
  },
  watch: {
    roleTypeName: {
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        switch (this.roleTypeName) {
          case "系统管理员":
          case "社区管理员":
            this.tabStyle.backgroundColor = "#00a94e"
            break;
          case "非系统管理员":
            this.tabStyle.backgroundColor = "#fcc72d"
            break;
          default:
            break;
        }
      }
    }
  },
  created() {
    this.createUrl()
  },
  methods: {
    editRole() {
      let data = {
        show: true,
        userId: this.userInfo.userId
      }
      this.$bus.$emit("changeShow", data) //使用自定义事件传递数据
    },
    createUrl() { // 查询头像图片流
      if (this.userInfo.user.avatar == null || this.userInfo.user.avatar.trim() == '') {
        return;
      }
      getImageReq(
        {
          path: this.userInfo.user.avatar
        },
        {}
      ).then((r) => {
        this.avatarUrl = window.URL.createObjectURL(r);
      });
    },

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
  min-height: 120px;
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
.infoBox {
  padding: 5px;
  font-size: 13px;
  color: #666666;
}
.lineBox {
  margin-top: 5px;
}
.roleBox {
  border-radius: 5px;
  padding: 3px;
  color: white;
  background-color: #ff6666;
  margin-right: 3px;
  margin-bottom: 3px;
}
</style>