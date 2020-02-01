<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" v-on:keyup.enter.native="seach">
            <el-button slot="append" icon="el-icon-search" @click="seach"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" v-slot="state">
          <el-switch v-model="state.row.mg_state" @change="userStateChanged(state.row)" />
        </el-table-column>
        <el-table-column label="操作" width="200px" v-slot="slot">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slot.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(slot.row.id)"></el-button>
          <!-- 分配角色 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '密码的长度在6~15个字符之间',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: this.checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: this.checkMobile,
          trigger: 'blur'
        }]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: this.checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: this.checkMobile,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 根据id删除对应的用户信息
    removeUserById(id) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`/users/${id}`)
        if (res.meta.status == 200) {
          this.getUserList();
          this.$message.success('删除用户成功!');
        } else {
          this.$message.error('删除用户失败!');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`/users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status == 200) {
          this.getUserList()
          this.$message.success("更新用户信息成功！")
          this.editDialogVisible = false
        } else {
          this.$message.error("更新用户信息失败！")
        }
      })
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post("/users", this.addForm)
        if (res.meta.status == 201) {
          this.getUserList()
          this.$message.success("添加用户成功！")
          this.addDialogVisible = false
        } else {
          this.$message.error("添加用户失败！")
        }
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 验证邮箱的规则
    checkEmail(rule, value, callBack) {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callBack()
      } else {
        return callBack(new Error("请输入合法的邮箱"))
      }
    },
    // 验证手机的规则
    checkMobile(rule, value, callBack) {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callBack()
      } else {
        return callBack(new Error("请输入合法的手机号"))
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 搜索用户
    seach() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 修改用户状态
    async userStateChanged(userInfo) {
      const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status == 200) {
        this.$message.success("更新用户状态成功！")
      } else {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error("更新用户状态失败！")
      }
    },
    // 查询用户列表
    async getUserList() {
      const { data: res } = await this.$axios.get('/users', { params: this.queryInfo })
      if (res.meta.status == 200) {
        this.userlist = res.data.users
        this.total = res.data.total
      } else {
        this.$message.error("获取用户列表失败！")
      }
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(`/users/${id}`)
      if (res.meta.status == 200) {
        this.editForm = res.data
      } else {
        return this.$message.error("查询用户信息失败！")
      }
      this.editDialogVisible = true
    }
  }
}
</script>