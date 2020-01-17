<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <routerLink to="/home" @click.native="goHome">
        <img :src="require('@/assets/heima.png')">
        <span>电商后台管理系统</span>
      </routerLink>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu ref="menu" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path" @open="record">
          <!-- 一级菜单 -->
          <el-submenu :index="`${index}`" v-for="(item,index) of menulist" :key="index">
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont" :class="iconslist[index]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="`/${subItem.path}`" v-for="(subItem,subIndex) of item.children" :key="subIndex">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconslist: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ],
      isCollapse: false,
      index: ""
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    record(index) {
      this.index = index
    },
    goHome() {
      this.$refs.menu.close(this.index)
      this.index = ""
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get("/menus")
      if (res.meta.status == 200) {
        this.menulist = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  > a {
    display: flex;
    align-items: center;

    span {
      color: #fff;
      margin-left: 20px;
    }
  }
}

.el-aside {
  background: #333744;

  .el-menu {
    border: none;
  }
}

.el-main {
  background: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>