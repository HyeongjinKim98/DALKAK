import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ICocktailType {
  id: number;
  name: string;
  koreanName: string;
  image: string;
  heartCount: number;
}
interface ICustomCocktailType {
  id: number;
  image: string;
  name: string;
  summary: string;
  user: {
    id: number;
    nickname: string;
  };
}
interface StoreState {
  id: number;
  nickname: string;
  birthDate: string;
  gender: string;
  isLoggedIn: boolean;
  surveyCompletion: boolean;
  myCocktails: ICocktailType[];
  customCocktails: ICustomCocktailType[];
  visited: ICocktailType[];
  setId: (id: number) => void;
  setNickname: (nickname: string) => void;
  setBirthDate: (birthDate: string) => void;
  setGender: (gender: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setSurveyCompletion: (surveyCompletion: boolean) => void;
  setMyCocktails: (myCocktails: ICocktailType[]) => void;
  setCustomCocktails: (customCocktails: ICustomCocktailType[]) => void;
  setVisited: (cocktail: ICocktailType) => void;
  clearAll: () => void;
  setMemberStateLogin: (
    id: number,
    nickname: string,
    surveyCompletion: boolean,
  ) => void;
}

const memberStore = create(
  persist<StoreState>(
    (set) => ({
      // 초기 상태
      id: 0,
      nickname: '',
      birthDate: '',
      gender: '',
      isLoggedIn: true,
      surveyCompletion: false,
      myCocktails: [],
      customCocktails: [],
      visited: [],
      setId: (id: number) => set({ id }),
      setNickname: (nickname: string) => set({ nickname }),
      setBirthDate: (birthDate: string) => set({ birthDate }),
      setGender: (gender: string) => set({ gender }),
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      setSurveyCompletion(surveyCompletion) {
        set({ surveyCompletion });
      },
      setMyCocktails(myCocktails) {
        set({ myCocktails });
      },
      setCustomCocktails(customCocktails) {
        set({ customCocktails });
      },
      setVisited: (cocktail) => {
        set((state) => {
          const isAlreadyVisited = state.visited.find(
            (item) => item.id === cocktail.id,
          );

          if (isAlreadyVisited) {
            return { visited: state.visited };
          }
          const updatedVisited = [cocktail, ...state.visited].slice(0, 10);
          return { visited: updatedVisited };
        });
      },
      clearAll: () =>
        set({
          id: 0,
          nickname: '',
          birthDate: '',
          gender: '',
          isLoggedIn: false,
          visited: [],
        }),
      setMemberStateLogin: (
        id: number,
        nickname: string,
        surveyCompletion: boolean,
      ) => {
        set({
          id,
          nickname,
          surveyCompletion,
          isLoggedIn: true,
        });
      },
    }),
    {
      name: 'member',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default memberStore;
