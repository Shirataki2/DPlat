<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>管理者ページ</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-row>
            <v-col cols="12" md="6">
              <v-card to="/admin/create_contest" height="200">
                <v-card-title>
                  コンテストの新規作成
                </v-card-title>
                <v-card-text>
                  【確認】FlaskサーバでPOSTを受けるAPIを予め作成しておく
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card to="/admin/create_information" height="200">
                <v-card-title>
                  おしらせの新規作成
                </v-card-title>
                <v-card-text>
                  全員に通知が行くかの設定を忘れずに
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  layout: 'admin',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
}
export default Index
</script>
