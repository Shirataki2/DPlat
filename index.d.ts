import { NuxtAxiosInstance } from "@nuxtjs/axios"

declare namespace AIC {
  export interface User {
    displayName: string
    photoURL: string
  }
}
export interface Context {
  $axios: NuxtAxiosInstance
}
