<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="@/assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
        <!-- 用户名 -->
        <el-form-item id="input" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item id="input" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [{
          required: true,
          message: '请输入登录名称',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符',
          trigger: 'blur'
        }],
        // 验证密码是否合法
        password: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '长度在 6 到 15 个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 点击重置按钮, 重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("/login", this.loginForm)
        if (res.meta.status == 200) {
          window.sessionStorage.setItem("token", res.data.token)
          this.$message.success("登录成功！")
          this.$router.push("/home")
        } else {
          this.$message.error("登录失败！")
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  background: #2b4b6b;
  height: 100%;
  position: relative;
}

.login-box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar-box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}

.login-form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
<style scoped>
.el-input >>> .el-input__prefix {
  left: 10px;
}
</style>