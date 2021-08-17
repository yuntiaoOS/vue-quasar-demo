<template>

  <div class="flex justify-center items-center" style="height: 100vh">

    <div class="row base-card-shadow" style="width: 60vw;min-width: 300px">
      <div class="col-6 flex justify-center items-center " v-show="$q.screen.gt.sm">
        <q-skeleton type="text" height="70%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>
      <div class="col flex justify-center items-center">
        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">cimo</h3>
            <q-form
              @submit="logon"
              class="q-gutter-md"
            >
              <!-- 用户名 -->
              <q-input class="logon-input"
                clearable
                standout="bg-cyan text-white"
                bottom-slots
                v-model="loginForm.username"
                label="账号"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '账号不能为空']"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle"/>
                </template>
              </q-input>
              <!-- 密码 -->
              <q-input class="logon-input"
                standout="bg-cyan text-white"
                bottom-slots
                v-model="loginForm.password"
                label="密码"
                :type="isPwd ? 'password' : 'text'" hint=""
                lazy-rules
                :rules="[ val => val && val.length > 3 || '密码不能小于3位']"
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input standout bottom-slots v-model="loginForm.code" label="验证码" :dense="false"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '验证码不能为空']"
              >
                <template v-slot:prepend>
                  <q-icon name="verified_user" />
                </template>
                <template v-slot:after>
                   <q-img
                    :src="codeUrl"
                    style="width:100px;height:38px;cursor: pointer;"
                    basic
                    spinner-color="white"
                    class="rounded-borders"
                    @click="getCode"
                  >
                  </q-img>
                </template>
              </q-input>

              
              <q-checkbox style="float: left;margin-top:-8px;margin-bottom:10px;" v-model="loginForm.rememberMe" label="记住密码"/>
              
              <!-- 登录按钮 -->
              <q-btn
                :loading="loading"
                class="logon-btn bg-logon-card-input"
                text-color="white"
                unelevated
                type="submit"
                label=""
                style="font-size: large;"
              >登 录 系 统
              </q-btn>
              <!-- <div class="row justify-between" style="margin-bottom: 20px;">
                <q-btn flat label="忘记密码"/>
                <q-btn outline label="我要注册"/>
              </div> -->
              <!-- <p class="text-grey" align="left">账号2 ：test &nbsp;&nbsp;&nbsp;&nbsp;密码均为空</p> -->
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script>
import LottieWebCimo from '../../components/LottieWebCimo/LottieWebCimo'
import { captchaRefresh } from "@/api/UserApi";
import { getCodeImg } from "@/api/login";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import { setToken } from "@/utils/auth";
export default {
  name: 'Logon',
  data () {
    return {
      isPwd: true,
      loginForm: {
        username: "admin",
        password: "123456",
        rememberMe: false,
        code: "1",
        uuid: ""
      },
      codeUrl:'',
      defaultOptions: {
        path: 'https://assets9.lottiefiles.com/packages/lf20_vo0a1yca.json',
        loop: true
      },
      loading: false,
      redirect: undefined,
      percentage: 0,
      isLottieF: false
    }
  },
  components: { LottieWebCimo },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created(){
    this.getCode()
    this.getCookie()
  },
  mounted(){
    console.log('---------mounted-----logon-----',this.$store)
  },
  methods: {
    getCode(){
      getCodeImg().then(res => {
        this.codeUrl = res.data.image_url ? process.env.VUE_APP_BASE_API + res.data.image_url : 'https://api.django-vue-admin.com/admin/captcha/image/b56b5b422dd63c4f71b22a8ffdfaa92eae049a43/';
        console.log('----------this.codeUrl----------',this.codeUrl)
        this.loginForm.uuid = res.data.key;
      })
    },
    getCookie() {
      const username = this.$q.cookies.get("username");
      const password = this.$q.cookies.get("password");
      const rememberMe = this.$q.cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    logon () {
      this.loading = !this.loading
      if (this.loginForm.rememberMe) {
        this.$q.cookies.set("username", this.loginForm.username, { expires: 30 });
        this.$q.cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
        this.$q.cookies.set("rememberMe", this.loginForm.rememberMe, { expires: 30 });
      } else {
        this.$q.cookies.remove("username");
        this.$q.cookies.remove("password");
        this.$q.cookies.remove("rememberMe");
      }
      this.$store.dispatch("user/Login", this.loginForm).then(() => {
        this.loading = false;
        this.$router.push({ path: this.redirect || "/" }).catch(() => {});
      }).catch(() => {
        this.loading = false;
        this.getCode();
      });
    },
    handleFinish (e) {
      this.isLottieF = e
    }
  }
}
</script>

<style scoped>
  .logon-btn {
    font-size: large;
    margin-top: 0px;
    margin-bottom: 20px;
    width: 100%;
  }

  .bg-logon-card-input {
    background: linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
    transition: all 0.3s ease-in-out;
    background-size: 200% auto;
  }

  .bg-logon-card-input:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }
</style>
