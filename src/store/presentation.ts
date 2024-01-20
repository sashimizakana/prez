import { defineStore } from "pinia";
import axios from "axios";
import { useClientStore } from "./client";
export interface Presentation {
  id: number | null;
  name: string;
  data?: any;
}
export interface presentationState {
  presentations: Array<Presentation>;
  currentId: number | null;
  editing: boolean;
  fullscreen: boolean;
  cursor: boolean;
}
export const usePresentationStore = defineStore("presentation", {
  state: () =>
    ({
      presentations: [],
      currentId: null,
      editing: false,
      fullscreen: false,
      cursor: false,
    } as presentationState),
  getters: {
    currentPresentation(state): Presentation | undefined {
      return state.presentations.find((p) => p.id === state.currentId);
    },
    currentPages(): number {
      if (!this.currentPresentation) {
        return 0;
      }
      return this.currentPresentation.data.contents?.length;
    },
  },
  actions: {
    async fetch() {
      const { data } = await axios.get("/api/presentations");
      this.presentations = data;
    },
    setCurrentId(id: number | null) {
      this.currentId = id;
    },
    setEditing(editing: boolean) {
      this.editing = editing;
    },
    setFullscreen(fullscreen: boolean) {
      this.fullscreen = fullscreen;
    },
    setCursor(cursor: boolean) {
      this.cursor = cursor;
    },
    async create(params: Presentation): Promise<Presentation> {
      const clientStore = useClientStore();
      const { data } = await clientStore.client!.post(
        "/api/presentations",
        params
      );
      this.presentations.push(data);
      return data as Presentation;
    },
    async save(params: Presentation, replace = false) {
      const clientStore = useClientStore();
      if (clientStore.client === null) {
        return;
      }
      const { data } = await clientStore.client!.patch(
        `/api/presentations/${params.id}`,
        params
      );
      if (replace) {
        const index = this.presentations.findIndex((p) => p.id === data.id);
        this.presentations.splice(index, 1, data);
      }
    },
    async update(data: any) {
      const params = { ...this.currentPresentation!, data };
      return this.save(params);
    },
    setData(data: any) {
      const presentation = this.currentPresentation;
      if (presentation) {
        presentation.data = data;
      }
    },
    removePage(index: number) {
      const presentation = this.currentPresentation;
      if (presentation) {
        const data = { ...presentation.data };
        data.contents.splice(index, 1);
        this.setData(data);
        this.update(data);
      }
    },
  },
});
