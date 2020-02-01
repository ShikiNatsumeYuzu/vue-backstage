<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px" v-slot="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 添加角色的表单数据对象
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editForm: {},
      // 表单的验证规则对象
      FormRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 根据id删除对应的角色信息
    removeRoleById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`/roles/${id}`)
        if (res.meta.status == 200) {
          this.getRolesList();
          this.$message.success('删除角色成功!');
        } else {
          this.$message.error('删除角色失败!');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      })
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`/roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status == 200) {
          this.getRolesList()
          this.$message.success("更新角色信息成功！")
          this.editDialogVisible = false
        } else {
          this.$message.error("更新角色信息失败！")
        }
      })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post("/roles", this.addForm)
        if (res.meta.status == 201) {
          this.getRolesList()
          this.$message.success("添加角色成功！")
          this.addDialogVisible = false
        } else {
          this.$message.error("添加角色失败！")
        }
      })
    },
    // 查询角色列表
    async getRolesList() {
      const { data: res } = await this.$axios.get("/roles")
      if (res.meta.status == 200) {
        this.rolelist = res.data
      } else {
        this.$message.error("获取角色列表失败！")
      }
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(`/roles/${id}`)
      if (res.meta.status == 200) {
        this.editForm = res.data
      } else {
        return this.$message.error("查询角色信息失败！")
      }
      this.editDialogVisible = true
    }
  }
}
</script>