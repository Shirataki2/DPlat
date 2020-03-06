<template>
  <transition>
    <v-content>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center display-5" style="font-family: Oxanium">
            <i>{{ error.statusCode }}</i>
          </h1>
          <div class="text-center">
            <p>
              {{ errorText[error.statusCode] }}
            </p>
            <v-btn outlined to="/">
              <v-icon>
                mdi-home
              </v-icon>
              トップページへ
            </v-btn>
            <v-btn outlined @click="$router.back()">
              <v-icon>
                mdi-arrow-left
              </v-icon>
              戻る
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-content>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
interface ErrorCode {
  statusCode: number,
  message: string,
  path: string
}

@Component({
  layout: 'empty',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Error extends Vue {
  @Prop({ type: Object, required: true })
  error: ErrorCode

  errorText = {
    403: 'アクセス権限がありません．何か不審なことでもしているのですか？',
    404: 'お探しのページは見つかりませんでした',
    500: 'サーバ内のエラーです．再度時間をおいてダメだったら開発者に連絡してください',
    503: '高負荷によるエラーかもしれません．ごめんなさい！',
    null: ''
  }
}
export default Error
</script>

<style scoped>
.display-5 {
  font-size: 7em;
  font-weight: 300;
}
</style>
