/* eslint-disable no-console */
/* eslint-disable no-alert */

'use client';

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import LockOutlined from '@mui/icons-material/LockOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';

import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';

import styles from './CustomCocktailWrite.module.scss';

import BtnWithIcon from '@/components/common/BtnWithIcon';
import CustomCocktailAddIngredientTest from '@/components/custom-cocktail/write/CustomCocktailAddIngredient';
import CustomCocktailAddRecipe from '@/components/custom-cocktail/write/CustomCocktailAddRecipe';
import CustomCocktailImageUpload from '@/components/custom-cocktail/write/CustomCocktailImageUpload';
import CustomCocktailInput from '@/components/custom-cocktail/write/CustomCocktailInput';
import authStore from '@/store/authStore';
// import { error } from 'console';
// import { RepeatOneSharp } from '@mui/icons-material';

interface Unit {
  id: number;
  name: string;
}

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

interface CustomIngredientList {
  id: number;
  name: string;
  image: string;
  category_id: number;
  amount?: number;
  ingredient_amount?: number;
  unit: Unit;
}

// type AddItemFunction = (id: number, name: string) => void;
interface Props {
  cocktailId: number;
}
export default function CustomCocktailWrite(props: Props) {
  const router = useRouter();

  const { cocktailId } = props;

  const [isPublic, setIsPublic] = useState(false);

  // const [koreanName, setKoreanName] = useState('');
  // const [englishName, setEnglishName] = useState('');
  const [names, setNames] = useState('');

  // 여기선 유저가 보낼 데이터

  const [customName, setCustomName] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customComment, setCustomComment] = useState('');
  const [customRecipe, setCustomRecipe] = useState('');
  const [changedRecipe, setChangedRecipe] = useState('');
  const [open, setOpen] = useState(false);

  /** 이미지 변경 관련 */
  const handleImageProps = (targetImage: File | null) => {
    setCustomImage(targetImage);
  };

  // 재료추가 기능 관련

  const [tempList, setTempList] = useState<CustomIngredientList[]>([]);

  // eslint-disable-next-line camelcase
  const filteredList = tempList.map(({ id, amount, unit: { id: unitId } }) => ({
    id,
    amount,
    // eslint-disable-next-line camelcase
    unit_id: unitId,
  }));

  const infoPlaceholder =
    '추가 설명이나 후기를 알려주세요.\n\n 이런 내용이 들어가면 좋아요!| 이 재료는 다른 걸로 대체할 수 있어요 | - 기존 레시피와 비교해서 맛이 이렇게 달라요 | - 이럴 때 마시는 걸 추천해요';

  //   eslint-disable-next-line no-shadow

  const getBaseData = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${cocktailId}`,
      {
        headers: {
          authorization,
        },
      },
    );

    if (!response.ok) {
      const error = new Error('Failed to fetch data');
      throw error;
    } else {
      const result = await response.json();

      const data = await result.data;

      return data;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getBaseCocktailData = async () => {
      const response = await getBaseData();
      setCustomRecipe(await response.recipe);
      setTempList(await response.cocktail_ingredients);
      setNames(`${response.name}, ${response.korean_name}`);
    };
    getBaseCocktailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChangedRecipe(customRecipe.split('\n').join('|'));
  }, [customRecipe]);

  const removeItem = (id: number) => {
    setTempList((prevList) => prevList.filter((data) => data.id !== id));
  };

  const handleInputChangeTest = (value: number, id: number) => {
    const updatedList = tempList.map((item) => {
      if (item.id === id) {
        return { ...item, amount: value };
      }
      return item;
    });

    setTempList(updatedList);
  };

  const handleUnitInputChange = (
    e: ChangeEvent<HTMLSelectElement>,
    unitId: number,
    id: number,
  ) => {
    const updatedList = tempList.map((item) => {
      if (item.id === id) {
        return { ...item, unit: { ...item.unit, id: unitId } };
      }
      return item;
    });

    setTempList(updatedList);
  };

  // eslint-disable-next-line no-shadow
  const splitedInfoPlaceholder = (infoPlaceholder: string) =>
    infoPlaceholder.split('|').join('\n');

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomComment(e.target.value);
  };

  const handleRecipeAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCustomRecipe(e.target.value);
    // setSplitedRecipe(e.target.value);
  };

  const handleInputChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 15) {
      e.target.value = e.target.value.slice(0, 15);
    }

    setCustomName(e.target.value);
  };

  const handleInputChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 20) {
      e.target.value = e.target.value.slice(0, 20);
    }

    setCustomSummary(e.target.value);
  };

  const handleIsPublic = () => {
    if (isPublic === false) {
      setIsPublic(true);
      setOpen(true);
    } else {
      setIsPublic(false);
      setOpen(false);
    }
  };

  const addTempList: (id: number, name: string) => void = (id, name) => {
    const isAlreadyAdded = tempList.some((item) => item.id === id);

    if (isAlreadyAdded) {
      Swal.fire({
        title: '이미 추가된 항목입니다.',
        icon: 'warning',
      });
      return;
    }

    if (tempList.length >= 12) {
      Swal.fire({
        title: '더 이상 재료를 추가할 수 없습니다.',
        icon: 'warning',
      });
      return;
    }
    const updatedList: CustomIngredientList[] = [
      ...tempList,
      {
        id,
        name,
        image: '',
        category_id: 1,
        amount: 1,
        unit: { id: 1, name: '개' },
      },
    ];
    setTempList(updatedList);
  };

  const postCustomCocktail = async () => {
    try {
      if (
        customImage &&
        cocktailId &&
        customName &&
        customSummary &&
        customComment &&
        customRecipe &&
        customRecipe.trim() !== '' &&
        filteredList.length > 0
      ) {
        const postInput = {
          cocktailId,
          customName,
          customSummary,
          customComment,
          // customRecipe,
          customRecipe: changedRecipe,
          open: open ? 'True' : 'False',
          customIngredientList: filteredList,
        };

        const formData = new FormData();
        formData.append('image', customImage);
        formData.append(
          'CustomCreateReqDto',
          new Blob([JSON.stringify(postInput)], { type: 'application/json' }),
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customs`,
          {
            method: 'POST',
            headers: {
              authorization,
            },
            body: formData,
          },
        );
        if (response.ok) {
          Swal.fire({
            title: '커스텀 칵테일이 등록되었습니다.',
            icon: 'success',
          });
          router.push(`/cocktail/customs?id=${cocktailId}`);
        } else {
          console.error('커스텀 레시피 등록 실패');
        }
      } else if (!customImage) {
        Swal.fire({
          title: '커스텀 칵테일 이미지를 업로드해주세요.',
          icon: 'warning',
        });
      } else if (!customName) {
        Swal.fire({
          title: '커스텀 칵테일 이름을 작성해주세요.',
          icon: 'warning',
        });
      } else if (!customSummary) {
        Swal.fire({
          title: '커스텀 칵테일 한 줄 요약(summary)을 작성해주세요.',
          icon: 'warning',
        });
      } else if (!customComment) {
        Swal.fire({
          title: '커스텀 칵테일 간단한 설명(comment)를 작성해주세요.',
          icon: 'warning',
        });
      } else if (!customRecipe || customRecipe.trim() === '') {
        Swal.fire({
          title: '커스텀 칵테일 레시피를 작성해주세요.',
          icon: 'warning',
        });
      } else if (filteredList.length < 1) {
        Swal.fire({
          title: '커스텀 칵테일 재료를 추가해주세요.',
          icon: 'warning',
        });
      }
    } catch (error) {
      /* empty */
    }
  };
  return (
    <div className={styles['flex-container']}>
      <div className={styles.container}>
        <div className={styles['title-container']}>
          <div className={styles.left}>
            <div className={styles.name}>
              활용한 칵테일
              <span className={styles['divide-line']}>&nbsp;&nbsp;&nbsp;|</span>
            </div>

            <div className={styles.explain}>
              {/* &nbsp;&nbsp; {englishName}, {koreanName} */}
              &nbsp;&nbsp;&nbsp;{names}
            </div>
          </div>
          <div />

          <div className={styles.buttons}>
            <div className={`${styles.button} ${styles.button1}`}>
              <BtnWithIcon
                icon={isPublic ? PublicOutlined : LockOutlined}
                text={isPublic ? '전체 공개' : '나만 보기'}
                btnStyle="empty-dark"
                handleOnClick={handleIsPublic}
              />
            </div>
            <div className={`${styles.button} ${styles.button2}`}>
              <BtnWithIcon
                text="커스텀 칵테일 등록"
                btnStyle="full-point"
                handleOnClick={postCustomCocktail}
              />
            </div>
          </div>
        </div>
        {/* <button type="button" onClick={confirmData}>
          저장된 데이터 확인
        </button> */}
        <div className={styles['inner-container']}>
          <div className={styles.space}>
            <CustomCocktailImageUpload handleImageProps={handleImageProps} />
            <div className={styles['input-container']}>
              <div className={styles.inputs}>
                <CustomCocktailInput
                  max={15}
                  placeText="커스텀 칵테일 이름을 입력해주세요"
                  inputValue={customName}
                  handleInputChange={handleInputChange1}
                />
              </div>
              <div className={styles.inputs}>
                <CustomCocktailInput
                  max={20}
                  placeText="기존 칵테일과 어떻게 다른가요?"
                  inputValue={customSummary}
                  handleInputChange={handleInputChange2}
                />
              </div>
              <div className={styles.inputs}>
                <textarea
                  className={styles['info-input']}
                  value={customComment}
                  placeholder={splitedInfoPlaceholder(infoPlaceholder)}
                  onChange={(e) => handleTextAreaChange(e)}
                />
              </div>
            </div>
          </div>
          <div className={styles.space}>
            <CustomCocktailAddIngredientTest
              handleInputChangeTest={handleInputChangeTest}
              handleUnitInputChange={handleUnitInputChange}
              removeItem={removeItem}
              tempList={tempList}
              addTempList={addTempList}
              // addItem={addItem}
            />
            <CustomCocktailAddRecipe
              handleInputChange={handleRecipeAreaChange}
              inputValue={customRecipe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
