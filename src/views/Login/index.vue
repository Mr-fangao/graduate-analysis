<!--
 * @Author: liqifeng
 * @Date: 2025-01-21 10:11:56
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-22 13:51:29
 * @Description: 
-->
<template>
    <div class="login-container">
    <div class="login-box">
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

const router = useRouter();

const loginForm = ref({
    username: '',
    password: '',
});

const loginRules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' },
    ],
});

const loginFormRef = ref<FormInstance | null>(null);

const handleLogin = () => {
    if (loginFormRef.value) {
        loginFormRef.value.validate((valid) => {
            if (valid) {
                // 模拟登录成功
                ElMessage.success('登录成功！');
                console.log('登录数据:', loginForm.value);
                // 跳转到菜单页面
                router.push('/home');
            } else {
                ElMessage.error('请检查表单输入');
            }
        });
    }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/img/bg.png'); /* 替换为你的背景图片路径 */
  background-size: cover;
  background-position: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-button {
  width: 100%;
}
</style>