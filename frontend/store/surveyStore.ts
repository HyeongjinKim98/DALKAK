/* eslint-disable implicit-arrow-linebreak */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IIngredientType } from '@/type/refrigeratorTypes';

const Question = [
  '당신이 궁금해요!',
  '좋아하는 칵테일을 최소 1개 입력해주세요',
  '언제 주로 술을 마시나요?',
  '어떤 베이스 술로 만들어진 칵테일을 원하시나요?',
  '선호하는 도수가 어떻게 되나요?',
  '선호하는 단맛 정도는 어떻게 되나요?',
  '싫어하는 재료가 있나요?',
  '설문조사가 완료되었어요!',
];

interface storeState {
  progress: number;
  nickname: string;
  birthDate: string;
  isNicknameChecked: boolean;
  isBirthDateChecked: boolean;
  gender: string;
  surveyCocktails: number[];
  baseId: number;
  occassionId: number;
  alcoholContent: number;
  sweetness: number;
  surveyIngredients: IIngredientType[];
  getQuestion: (process: number) => string;
  nextProgress: () => void;
  beforeProgress: () => void;
  setNickname: (nickname: string) => void;
  setBirthDate: (birthDate: string) => void;
  setisNicknameChecked: (isNicknameChecked: boolean) => void;
  setisBirthDateChecked: (isBirthDateChecked: boolean) => void;
  setGender: (gender: string) => void;
  setSurveyCocktails: (cocktails: number[]) => void;
  addSurveyCocktails: (cocktail: number) => void;
  deleteSurveyCocktails: (cocktail: number) => void;
  setBaseId: (baseId: number) => void;
  setOccationId: (occationId: number) => void;
  setAlcoholContent: (alcoholContent: number) => void;
  setSweetness: (sweetness: number) => void;
  addSurveyIngredients: (ingredient: IIngredientType) => void;
  deleteSurveyIngredients: (ingredient: IIngredientType) => void;
  clearSurvey: () => void;
}

const surveyStore = create(
  persist<storeState>(
    (set, get) => ({
      progress: 0,
      nickname: '',
      birthDate: '',
      isNicknameChecked: false,
      isBirthDateChecked: false,
      gender: '',
      surveyCocktails: [],
      baseId: 0,
      occassionId: 0,
      alcoholContent: 0,
      sweetness: 0,
      surveyIngredients: [],

      getQuestion: (process: number) => Question[process],
      // 다음 페이지 이동
      nextProgress: () => {
        if (get().progress < 6) {
          set({ progress: get().progress + 1 });
        }
      },
      // 이전 페이지로 이동
      beforeProgress: () => {
        if (get().progress > 0) {
          set({ progress: get().progress - 1 });
        }
      },
      // set survey states
      setNickname: (nickname: string) => set({ nickname }),
      setisBirthDateChecked(isBirthDateChecked) {
        set({ isBirthDateChecked });
      },
      setisNicknameChecked(isNicknameChecked) {
        set({ isNicknameChecked });
      },
      setBirthDate: (birthDate: string) => set({ birthDate }),
      setGender(gender: string) {
        set({ gender });
      },
      setSurveyCocktails: (cocktails: number[]) =>
        set({ surveyCocktails: cocktails }),
      addSurveyCocktails: (cocktail: number) =>
        set({ surveyCocktails: [...get().surveyCocktails, cocktail] }),
      deleteSurveyCocktails: (cocktail: number) =>
        set({
          surveyCocktails: get().surveyCocktails.filter(
            (item) => item !== cocktail,
          ),
        }),
      setBaseId: (baseId: number) => set({ baseId }),
      setOccationId: (occassionId: number) => set({ occassionId }),
      setAlcoholContent: (alcoholContent: number) => set({ alcoholContent }),
      setSweetness: (sweetness: number) => set({ sweetness }),
      addSurveyIngredients: (ingredient: IIngredientType) =>
        set({ surveyIngredients: [...get().surveyIngredients, ingredient] }),
      deleteSurveyIngredients: (ingredient: IIngredientType) =>
        set({
          surveyIngredients: get().surveyIngredients.filter(
            (item) => item !== ingredient,
          ),
        }),
      clearSurvey: () =>
        set({
          progress: 0,
          surveyCocktails: [],
          baseId: 0,
          occassionId: 0,
          alcoholContent: 0,
          sweetness: 0,
          surveyIngredients: [],
        }),
    }),
    {
      name: 'survey',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
export default surveyStore;
