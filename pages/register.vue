<template>
  <v-container>
    <v-row>
      <v-col xs12 lg="8" offset-lg="2" sm="10" offset-sm="1">
        <v-card raised>
          <v-card-title class="display-2 justify-center pa-8">
            新規登録
          </v-card-title>
          <p class="caption text-center">
            新規登録は「
            <nuxt-link to="/login">
              ログイン画面
            </nuxt-link>
            」からGoogle認証でのみ行っています
          </p>
          <v-divider />
          <v-alert v-if="!!alertText" class="ma-3" type="error">
            {{ alertText }}
          </v-alert>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent
            >
              <v-text-field
                v-model="name"
                disabled
                name="name"
                label="名前 *"
                :rules="[
                  (v) => !!v || '必須項目です',
                  (v) => v.length <= 16 || '16文字以下で入力して下さい'
                ]"
              />
              <v-text-field
                v-model="email"
                disabled
                name="email"
                label="メールアドレス *"
                :rules="[
                  (v) => !!v || '必須項目です',
                  (v) => /.+@.+\..+/.test(v) || '有効な形式ではありません'
                ]"
              />
              <v-text-field
                v-model="password"
                disabled
                name="password"
                label="パスワード *"
                hint="6文字以上"
                :rules="[
                  (v) => !!v || '必須項目です',
                  (v) => v.length >= 6 || '6文字以上で入力して下さい'
                ]"
                counter
                :append-icon="passwordInvisibility ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordInvisibility ? 'password' : 'text'"
                @click:append="passwordInvisibility = !passwordInvisibility"
              />
              <v-btn color="info" text disabled @click="submit">
                Submit
              </v-btn>
              <v-btn color="error" text disabled>
                Reset
              </v-btn>
            </v-form>
            <v-col xs="12" class="text-center ma-1">
              <p>
                ログインは <nuxt-link to="/login">
                  こちら
                </nuxt-link>
              </p>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { authStore } from '../store'

@Component({
  middleware: 'not-authenticated'
})
class Login extends Vue {
  valid = false
  name = ''
  email = ''
  password = ''
  passwordInvisibility = true
  alertText = ''

  async submit () {
    const form: any = this.$refs.form
    if (!form.validate()) {
      this.alertText = 'Invalid Form'
      return
    }
    try {
      const newUserCredential = await this.$auth.createUserWithEmailAndPassword(this.email, this.password)
      const newUser = newUserCredential.user
      if (newUser) {
        newUser.updateProfile({
          displayName: this.name
        })
        await authStore.login(newUser)
        this.$router.push('/')
      }
    } catch (e) {
      const errorCode = e.code
      if (errorCode === 'auth/weak-password') {
        this.alertText = '推定されやすいパスワードです．より強力なパスワードにしてください'
      } else if (errorCode === 'auth/email-already-in-use') {
        this.alertText = '既に使用されているメールアドレスです'
      } else {
        this.alertText = '不明なエラーが発生しました'
      }
    }
  }

  reset () {
    this.name = ''
    this.email = ''
    this.password = ''
    this.passwordInvisibility = true
    this.alertText = ''
    const form:any = this.$refs.form
    if (form) {
      form.resetValidation()
    }
  }
}
export default Login
</script>
