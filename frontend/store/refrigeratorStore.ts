import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import authStore from './authStore';
import { IRefrigeratorType } from '@/type/refrigeratorTypes';

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

const useRefrigeratorStore = create(
  persist<IRefrigeratorType>(
    (set) => ({
      refgList: [],
      memoList: [],
      setRefgList: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/refrigerator`,
          {
            headers: { authorization },
          },
        );
        const json = await res.json();
        set({ refgList: await json.data });
      },
      setMemoList: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/basket`, {
          headers: { authorization },
        });
        const json = await res.json();
        set({ memoList: await json.data });
      },
      addRefrList: (id: number) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/refrigerator`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization,
          },
          body: JSON.stringify({
            ingredient_id: id,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.code === 201) {
              useRefrigeratorStore.getState().setRefgList();
            }
          });
      },
      removeRefrList: (id: number) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/refrigerator/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.code === 200) {
              useRefrigeratorStore.getState().setRefgList();
            }
          });
      },
      addMemoList: (id: number) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/basket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization,
          },
          body: JSON.stringify({
            ingredient_id: id,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.code === 201) {
              useRefrigeratorStore.getState().setMemoList();
            }
          });
      },
      removeMemoList: (id: number) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/basket/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.code === 200) {
              useRefrigeratorStore.getState().setMemoList();
            }
          });
      },
      memoToRefr: async (id: number) => {
        useRefrigeratorStore.getState().addRefrList(id);
        useRefrigeratorStore.getState().removeMemoList(id);
        useRefrigeratorStore.getState().setRefgList();
        useRefrigeratorStore.getState().setMemoList();
      },
      refrToMemo: async (id: number) => {
        useRefrigeratorStore.getState().removeRefrList(id);
        useRefrigeratorStore.getState().addMemoList(id);
        useRefrigeratorStore.getState().setRefgList();
        useRefrigeratorStore.getState().setMemoList();
      },
      clearRefgMemo: () => {
        set({ refgList: [] });
        set({ memoList: [] });
      },
    }),
    {
      name: 'refrigerator',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRefrigeratorStore;
