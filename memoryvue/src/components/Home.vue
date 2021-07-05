<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img class="logoimg" src="../assets/logo.png" alt="" />
        <span>信用卡提醒系统</span>
      </div>
      <el-button type="info" @click="logout">安全退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#383d40" text-color="#fff" active-text-color="#409eff"
        :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{item.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="it.path" v-for="it in item.sList" :key="it.id" @click="saveNavState(it.path)">
              <template slot="title">
                <i :class="iconsObject[it.id]"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data(){
    return {
      // 菜单列表
      menuList:[],
      isCollapse:false,
      iconsObject:{
        '100':'el-icon-s-operation',
        '200':'el-icon-s-tools',
        '101':'el-icon-user-solid',
        '102':'el-icon-key',
        '103':'el-icon-bank-card',
        '104':'el-icon-present',
        '201':'el-icon-position',
        '202':'el-icon-notebook-1',
        '203':'el-icon-mobile',
      },
      activePath:'/welcome',
    }
  },
  created(){
    // 查询menuList
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath'); // 取出session里的path,进行动态修改
  },
  methods: {
    // 安全退出
    logout() {
      window.sessionStorage.clear(); // 清楚用户数据
      this.$router.push("/login"); // 回到首页
    },
    // 获取导航菜单方法
    async getMenuList(){
      const {data:res} = await this.$http.get("menus");
      console.log(res);
      if(res.flag != 200) return this.$message.console.error("获取列表失败!!!");
      this.menuList = res.menus;// 访问成功
    },
    // 控制菜单伸缩
    toggleCollapse(){
      this.isCollapse = !this.isCollapse;
    },
    // 保存路径
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath); // 将路径存入session
      this.activePath = activePath;
    }
  }
};
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
}
// 头部样式
.el-header {
  background-color: #1cb2cb;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
// 侧边栏样式
.el-aside {
  background-color: #383d40;
  .el-menu{
    border-right: none;
  }
}
// 主体内容样式
.el-main {
  background-color: #eaedf1;
}
.logoimg {
  width: 55px;
  height: 55px;
}
// |||按钮样式
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff; 
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>