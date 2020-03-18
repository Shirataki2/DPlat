<template>
  <transition>
    <v-container>
      <v-row>
        <v-col class="col-12" sm="10" offset-sm="1">
          <v-card>
            <v-row>
              <v-col class="col-12">
                <v-card-title>
                  <v-row>
                    <v-col sm="3" md="2" class="col-4 mt-n5">
                      <v-img :src="photoURL" width="100%" aspect-ratio="1" />
                    </v-col>
                    <v-row>
                      <v-col class="title col-12 mb-n7">
                        {{ profile.displayName }}
                        <span class="grey--text text--lighten-1 ml-2">
                          / {{ profile.nickname }}
                        </span>
                      </v-col>
                      <v-col class="col-12">
                        <v-avatar class="mt-1" :color="status.status === 'online' ? 'success' : 'error'" size="9" />
                        <span class="overline">
                          {{ status.status }}
                          <span v-if="status.status !== 'online'">{{ lastActive }}</span>
                        </span>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-card-title>
              </v-col>
              <v-col class="col-12">
                <v-tabs
                  v-model="tab"
                  grow
                  icons-and-text
                >
                  <v-tabs-slider />
                  <!-- Tab 1 -->
                  <v-tab
                    href="#tab-1"
                  >
                    基本情報
                    <v-icon>
                      mdi-information
                    </v-icon>
                  </v-tab>
                  <v-tab-item
                    value="tab-1"
                  >
                    <v-card
                      flat
                      tile
                    >
                      <v-card-text>
                        <v-row class="subtitle-1">
                          <template v-if="profile.displayName">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              名前
                            </v-col>
                            <v-col cols="8">
                              {{ profile.displayName }}
                            </v-col>
                          </template>
                          <template v-if="profile.nickname">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              ニックネーム
                            </v-col>
                            <v-col cols="8">
                              {{ profile.nickname }}
                            </v-col>
                          </template>
                          <template v-if="profile.description">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              自己紹介
                            </v-col>
                            <v-col cols="8">
                              {{ profile.description }}
                            </v-col>
                          </template>
                          <template v-if="profile.university || profile.grade">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              所属
                            </v-col>
                            <v-col cols="8">
                              <span v-if="profile.university">{{ profile.university }}  </span>
                              <span v-if="profile.grade">{{ profile.grade }}</span>
                            </v-col>
                          </template>
                          <template v-if="genderList[profile.gender]">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              性別
                            </v-col>
                            <v-col cols="8">
                              {{ genderList[profile.gender] }}
                            </v-col>
                          </template>
                          <v-col
                            v-if="Object.keys(profile.skills).map((skill) => profile.skills[skill]).reduce((acc, v) => acc + v)"
                            cols="4"
                            class="sibtitle-1 text-right"
                            style="font-weight: bold; position: relative; top: 11px"
                          >
                            スキル
                          </v-col>
                          <v-col cols="8">
                            <v-row v-if="profile.skills.python > 0" class="mt-n2 pb-1">
                              <v-col cols="2">
                                <p class="subtitle-2 text-right mt-2">
                                  Python
                                </p>
                              </v-col>
                              <v-col cols="10">
                                <v-rating
                                  v-model="profile.skills.python"
                                  color="yellow darken-1"
                                  background-color="grey"
                                  readonly
                                  half-increments
                                />
                              </v-col>
                            </v-row>
                            <v-row v-if="profile.skills.ml > 0" class="mt-n2 pb-1">
                              <v-col cols="2">
                                <p class="subtitle-2 text-right mt-2">
                                  機械学習
                                </p>
                              </v-col>
                              <v-col cols="10">
                                <v-rating
                                  v-model="profile.skills.ml"
                                  color="yellow darken-1"
                                  background-color="grey"
                                  readonly
                                  half-increments
                                />
                              </v-col>
                            </v-row>
                            <v-row v-if="profile.skills.shell > 0" class="mt-n2 pb-1">
                              <v-col cols="2">
                                <p class="subtitle-2 text-right mt-2">
                                  Shell Script
                                </p>
                              </v-col>
                              <v-col cols="10">
                                <v-rating
                                  v-model="profile.skills.shell"
                                  color="yellow darken-1"
                                  background-color="grey"
                                  readonly
                                  half-increments
                                />
                              </v-col>
                            </v-row>
                            <v-row v-if="profile.skills.git > 0" class="mt-n2 pb-1">
                              <v-col cols="2">
                                <p class="subtitle-2 text-right mt-2">
                                  Git
                                </p>
                              </v-col>
                              <v-col cols="10">
                                <v-rating
                                  v-model="profile.skills.git"
                                  color="yellow darken-1"
                                  background-color="grey"
                                  readonly
                                  half-increments
                                />
                              </v-col>
                            </v-row>
                            <v-row v-if="profile.skills.japanese > 0" class="mt-n2 pb-1">
                              <v-col cols="2">
                                <p class="subtitle-2 text-right mt-2">
                                  日本語
                                </p>
                              </v-col>
                              <v-col cols="10">
                                <v-rating
                                  v-model="profile.skills.japanese"
                                  readonly
                                  color="yellow darken-1"
                                  background-color="grey"
                                  half-increments
                                />
                              </v-col>
                            </v-row>
                          </v-col>
                          <template v-if="profile.otherSkills">
                            <v-col cols="4" class="text-right" style="font-weight: bold">
                              その他経験
                            </v-col>
                            <v-col cols="8">
                              {{ profile.otherSkills }}
                            </v-col>
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- Tab 2 -->
                  <v-tab
                    href="#tab-2"
                  >
                    成績
                    <v-icon>
                      mdi-medal
                    </v-icon>
                  </v-tab>
                  <v-tab-item
                    value="tab-2"
                  >
                    <v-card
                      flat
                      tile
                    >
                      <v-card-text>
                        <v-card
                          v-for="competition in competitions"
                          :key="competition.name"
                          flat
                          tile
                        >
                          <v-card-text>
                            <v-card outlined class="mb-n3" :to="`/competitions/${competition.id}`">
                              <v-card-title>{{ competition.name }}</v-card-title>
                              <v-card-text>
                                Score: <span class="title">{{ competition.highscore }}</span>
                                <div class="text-right">
                                  {{ competition.n }}回提出
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- Tab 3 -->
                  <v-tab
                    href="#tab-3"
                  >
                    スレッド
                    <v-icon>
                      mdi-message
                    </v-icon>
                  </v-tab>
                  <v-tab-item
                    value="tab-3"
                  >
                    <v-card
                      v-for="room in rooms"
                      :key="room.name"
                      flat
                      tile
                    >
                      <v-card-text>
                        <v-card outlined class="mb-n3" :to="`/chat/${room.name}`">
                          <v-card-title>{{ room.name }}</v-card-title>
                          <v-card-text>
                            {{ room.description }}
                          </v-card-text>
                          <v-card-subtitle class="text-right overline">
                            {{ room.created_at }}
                          </v-card-subtitle>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- Tab 4 -->
                  <v-tab
                    href="#tab-4"
                  >
                    設定変更
                    <v-icon>
                      mdi-account-cog
                    </v-icon>
                  </v-tab>
                  <v-tab-item
                    value="tab-4"
                  >
                    <v-card
                      flat
                      tile
                    >
                      <v-card-text>
                        <v-form
                          ref="profile"
                          v-model="valid"
                        >
                          <div class="text-center pb-4 mt-3">
                            <v-btn :disabled="disable" large outlined color="success" @click="submit">
                              <v-icon>mdi-upload</v-icon>
                              更新
                            </v-btn>
                            <v-btn large outlined color="error" class="ml-3" @click="reset">
                              <v-icon>mdi-undo</v-icon>
                              破棄
                            </v-btn>
                          </div>
                          <v-text-field
                            v-model="newProfile.displayName"
                            outlined
                            label="名前 *"
                            :counter="12"
                            :rules="[
                              (v) => !!v || '必須項目です',
                              (v) => v.length <= 12 || '12文字以下にしてください'
                            ]"
                            required
                          />
                          <v-text-field
                            v-model="newProfile.nickname"
                            outlined
                            label="ニックネーム *"
                            :counter="20"
                            :rules="[
                              (v) => !!v || '必須項目です',
                              (v) => v.length <= 20 || '20文字以下にしてください'
                            ]"
                            required
                          />
                          <v-textarea
                            v-model="newProfile.description"
                            rows="4"
                            auto-grow
                            outlined
                            label="自己紹介"
                            :counter="140"
                            :rules="[
                              (v) => v.length <= 140 || '140文字以下にしてください'
                            ]"
                          />
                          <v-text-field
                            v-model="newProfile.university"
                            outlined
                            label="大学"
                            :counter="16"
                            :rules="[
                              (v) => v.length <= 16 || '16文字以下にしてください'
                            ]"
                          />
                          <p class="title">
                            学年
                          </p>
                          <v-row justify="space-around">
                            <v-radio-group v-model="newProfile.grade" row>
                              <v-radio label="B1" value="B1" />
                              <v-radio label="B2" value="B2" />
                              <v-radio label="B3" value="B3" />
                              <v-radio label="B4" value="B4" />
                              <v-radio label="M1" value="M1" />
                              <v-radio label="M2" value="M2" />
                              <v-radio label="D1" value="D1" />
                              <v-radio label="D2" value="D2" />
                              <v-radio label="D3" value="D3" />
                              <v-radio label="無回答" :value="false" />
                            </v-radio-group>
                          </v-row>
                          <p class="title">
                            性別
                          </p>
                          <v-row justify="space-around">
                            <v-radio-group v-model="newProfile.gender" row>
                              <v-radio label="男性" value="male" />
                              <v-radio label="女性" value="female" />
                              <v-radio label="その他" value="other" />
                              <v-radio label="無回答" :value="false" />
                            </v-radio-group>
                          </v-row>
                          <p class="title">
                            言語等のスキル
                          </p>
                          <p class="caption grey--text ml-3">
                            能力の熟練度を0〜5つ星でレビューしてください．横のキャプションをクリックすると評価が0に戻ります．
                          </p>
                          <v-row class="mt-n2 pb-1">
                            <v-col cols="5">
                              <p class="subtitle1 text-right mt-2" style="cursor: pointer" @click="() => newProfile.skills.python = 0">
                                Python
                              </p>
                            </v-col>
                            <v-col cols="7">
                              <v-rating
                                v-model="newProfile.skills.python"
                                color="yellow darken-1"
                                background-color="grey"
                                half-increments
                              />
                            </v-col>
                          </v-row>
                          <v-row class="mt-n2 pb-1">
                            <v-col cols="5">
                              <p class="subtitle1 text-right mt-2" style="cursor: pointer" @click="() => newProfile.skills.ml = 0">
                                機械学習
                              </p>
                            </v-col>
                            <v-col cols="7">
                              <v-rating
                                v-model="newProfile.skills.ml"
                                color="yellow darken-1"
                                background-color="grey"
                                half-increments
                              />
                            </v-col>
                          </v-row>
                          <v-row class="mt-n2 pb-1">
                            <v-col cols="5">
                              <p class="subtitle1 text-right mt-2" style="cursor: pointer" @click="() => newProfile.skills.shell = 0">
                                Shell Script
                              </p>
                            </v-col>
                            <v-col cols="7">
                              <v-rating
                                v-model="newProfile.skills.shell"
                                color="yellow darken-1"
                                background-color="grey"
                                half-increments
                              />
                            </v-col>
                          </v-row>
                          <v-row class="mt-n2 pb-1">
                            <v-col cols="5">
                              <p class="subtitle1 text-right mt-2" style="cursor: pointer" @click="() => newProfile.skills.git = 0">
                                Git
                              </p>
                            </v-col>
                            <v-col cols="7">
                              <v-rating
                                v-model="newProfile.skills.git"
                                color="yellow darken-1"
                                background-color="grey"
                                half-increments
                              />
                            </v-col>
                          </v-row>
                          <v-row class="mt-n2 pb-1">
                            <v-col cols="5">
                              <p class="subtitle1 text-right mt-2" style="cursor: pointer" @click="() => newProfile.skills.japanese = 0">
                                日本語
                              </p>
                            </v-col>
                            <v-col cols="7">
                              <v-rating
                                v-model="newProfile.skills.japanese"
                                color="yellow darken-1"
                                background-color="grey"
                                half-increments
                              />
                            </v-col>
                          </v-row>
                          <v-textarea
                            v-model="newProfile.otherSkills"
                            rows="5"
                            auto-grow
                            outlined
                            label="その他開発経験等のある言語やフレームワーク"
                            :counter="200"
                            :rules="[
                              (v) => v.length <= 200 || '200文字以下にしてください'
                            ]"
                          />
                          <div class="text-center pb-4 mt-3">
                            <v-btn :disabled="disable" large outlined color="success" @click="submit">
                              <v-icon>mdi-upload</v-icon>
                              更新
                            </v-btn>
                            <v-btn large outlined color="error" class="ml-3" @click="reset">
                              <v-icon>mdi-undo</v-icon>
                              破棄
                            </v-btn>
                          </div>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        bottom
        :color="snackbarState"
        :timeout="3000"
      >
        {{ snackbarText }}
        <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { db, storage } from '@/plugins/firebase'
import { authStore } from '@/store'
import dateFormatter, { toDifDate } from '@/utils/date-formatter'

interface Profile {
  nickname: string,
  photoURL: string,
  displayName: string,
  description: string | null,
  university: string | null,
  grade: string | null,
  gender: 'male' | 'female' | 'other' | 'none' | null,
  skills: {
    python: number,
    ml: number,
    shell: number,
    git: number,
    japanese: number,
  },
  otherSkills: string,
  experiense: string,
}

interface Room {
  name: string,
  description: string,
  created_at: string
}

@Component({
  layout: 'protected',
  async asyncData () {
  },
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  tab: boolean = false
  photoURL: string = ''
  lastActive: string = ''
  valid: boolean = false
  valid2: boolean = false
  snackbar: boolean = false
  snackbarState = 'success'
  snackbarText = ''
  disable: boolean = false
  user: any = ''
  status: any = ''
  profile: Profile = {
    nickname: '',
    photoURL: '',
    displayName: '',
    description: '',
    university: '',
    grade: '',
    gender: null,
    skills: {
      python: 0,
      ml: 0,
      shell: 0,
      git: 0,
      japanese: 0
    },
    otherSkills: '',
    experiense: ''
  }

  newProfile: Profile = {
    nickname: '',
    photoURL: '',
    displayName: '',
    description: '',
    university: '',
    grade: '',
    gender: null,
    skills: {
      python: 0,
      ml: 0,
      shell: 0,
      git: 0,
      japanese: 0
    },
    otherSkills: '',
    experiense: ''
  }

  genderList = {
    male: '男性',
    female: '女性',
    other: 'その他',
    none: null
  }

  rooms: Room[] = []
  competitions: any[] = []

  head () {
    return {
      title: this.user ? this.user.displayName : 'ユーザーページ'
    }
  }

  async validate () {
    if (!authStore.user) { return }
    const user = await db.collection('users').doc(authStore.user.uid).get()
    if (user.exists) {
      return true
    } else {
      return false
    }
  }

  async mounted () {
    if (!authStore.user) { return }
    const [snapUser, snapStat, snapRooms, snapCompetitions] = await Promise.all([
      db.collection('users').doc(authStore.user.uid).get(),
      db.collection('status').doc(authStore.user.uid).get(),
      db.collection('users').doc(authStore.user.uid).collection('chatrooms').get(),
      db.collection('users').doc(authStore.user.uid).collection('competitions').get()
    ])
    if (snapUser.exists) {
      const data: any = snapUser.data()
      if (data) {
        this.user = data
      }
    }
    if (snapUser.exists) {
      const data: any = snapUser.data()
      if (data) {
        // eslint-disable-next-line no-undef
        const user: Profile = data
        this.photoURL = await storage.refFromURL(user.photoURL).getDownloadURL()
        this.profile = {
          displayName: user.displayName,
          nickname: user.nickname,
          photoURL: this.photoURL,
          university: user.university || '',
          description: user.description || '',
          grade: user.grade || null,
          gender: user.gender || null,
          skills: {
            python: user.skills?.python || 0,
            ml: user.skills?.ml || 0,
            shell: user.skills?.shell || 0,
            git: user.skills?.git || 0,
            japanese: user.skills?.japanese || 0
          },
          otherSkills: user.otherSkills || '',
          experiense: user.experiense || ''
        }
      }
    } else {
    }
    if (!snapRooms.empty) {
      snapRooms.forEach((snap) => {
        const room = snap.data()
        this.rooms.push({
          name: snap.id,
          description: room.description,
          created_at: dateFormatter(room.created_at.toDate())
        })
      })
    }
    if (!snapCompetitions.empty) {
      snapCompetitions.forEach((snap) => {
        const compdata = snap.data()
        this.competitions.push({
          ...compdata,
          id: snap.id
        })
      })
    }
    try {
      const prof = localStorage.getItem('user/profile')
      if (prof) {
        this.newProfile = Object.assign({}, JSON.parse(prof))
      } else {
        this.newProfile = Object.assign({}, this.profile)
      }
    } catch {
      this.newProfile = Object.assign({}, this.profile)
    }
    if (snapStat.exists) {
      const data: any = snapStat.data()
      if (data) {
        this.status = data
        const Now = Date.now()
        if (this.status.last_changed) {
          this.lastActive = ` (${toDifDate(Now - this.status.last_changed.toDate().getTime())})`
        }
      }
    }
  }

  async submit () {
    const form: any = this.$refs.profile
    if (!form.validate()) { return }
    this.disable = true
    await db.collection('users').doc(authStore.user?.uid).update(this.newProfile)
    this.snackbar = true
    this.snackbarState = 'success'
    this.snackbarText = '更新しました．'
    this.disable = false
    localStorage.removeItem('user/profile')
    this.profile = Object.assign({}, this.newProfile)
  }

  reset () {
    if (confirm('破棄してもよろしいですか？')) {
      this.newProfile = Object.assign({}, this.profile)
      localStorage.removeItem('user/profile')
    }
  }

  @Watch('newProfile', { deep: true })
  onChange (val: Profile, _oldval: Profile) {
    localStorage.setItem('user/profile', JSON.stringify(this.newProfile))
  }
}
export default Index
</script>
