import { defineStore } from "pinia";
import axios, { AxiosInstance } from "axios";
export interface clientState {
  token: string;
  client: AxiosInstance | null;
  authorized: boolean;
}
export const useClientStore = defineStore("client", {
  state: () =>
    ({
      token: "",
      client: null,
      authorized: false,
    } as clientState),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
      this.client = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.authorized = true;
    },
  },
});
