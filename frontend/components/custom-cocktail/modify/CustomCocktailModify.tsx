/* eslint-disable no-alert */
/* eslint-disable no-lonely-if */

'use client';

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import LockOutlined from '@mui/icons-material/LockOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';

import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';

import styles from './CustomCocktailModify.module.scss';

import BtnWithIcon from '@/components/common/BtnWithIcon';
import CustomCocktailAddIngredient from '@/components/custom-cocktail/write/CustomCocktailAddIngredient';
import CustomCocktailAddRecipe from '@/components/custom-cocktail/write/CustomCocktailAddRecipe';
import CustomCocktailImageUpload from '@/components/custom-cocktail/write/CustomCocktailImageUpload';
import CustomCocktailInput from '@/components/custom-cocktail/write/CustomCocktailInput';
import authStore from '@/store/authStore';

interface Unit {
  id: number;
  name: string;
}

interface CustomIngredientList {
  id: number;
  name: string;
  image: string;
  category_id: number;
  ingredient_amount?: number;
  amount?: number;
  unit: Unit;
}

interface Props {
  customId: number;
}
export default function CustomCocktailModify(props: Props) {
  const { customId } = props;
  const router = useRouter();

  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();

  const [name, setName] = useState('');

  // 여기선 유저가 보낼 데이터

  // const [uploadedImage, setUploadedImage] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customImage, setCustomImage] = useState<string>('');
  const [customComment, setCustomComment] = useState('');
  const [customRecipe, setCustomRecipe] = useState('');
  const [changedRecipe, setChangedRecipe] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  /** 이미지 변경 관련 */

  const [newImage, setNewImage] = useState<File | null>(null);
  const handleImageProps = (targetImage: File | null) => {
    setNewImage(targetImage);
  };

  // 재료추가 기능 관련

  const [tempList, setTempList] = useState<CustomIngredientList[]>([]);

  // eslint-disable-next-line camelcase
  const filteredList = tempList.map(
    // eslint-disable-next-line camelcase
    ({ id, ingredient_amount, unit: { id: unitId } }) => ({
      id,
      // eslint-disable-next-line camelcase
      amount: ingredient_amount,
      // eslint-disable-next-line camelcase
      unit_id: unitId,
    }),
  );

  const infoPlaceholder =
    '추가 설명이나 후기를 알려주세요.\n\n 이런 내용이 들어가면 좋아요!| 이 재료는 다른 걸로 대체할 수 있어요 | - 기존 레시피와 비교해서 맛이 이렇게 달라요 | - 이럴 때 마시는 걸 추천해요';

  //   eslint-disable-next-line no-shadow

  const getBaseData = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/customs/${customId}`,
      {
        // 분명 같은 토큰인데 왜 어쩔때는 위에 코드가 안되고
        // 어쩔때는 아래 코드가 안 되는 건지 모르겠음...
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
  }, [authorization, customId]);

  useEffect(() => {
    const getBaseCocktailData = async () => {
      const response = await getBaseData();
      setName(await response.name);
      setCustomImage(await response.image);
      setCustomRecipe(await response.recipe);
      setTempList(await response.custom_ingredients);
      setCustomName(await response.name);
      setCustomSummary(await response.summary);
      setCustomComment(await response.comment);
      setIsPublic(await response.open);
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
        return { ...item, ingredient_amount: value };
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
    } else {
      setIsPublic(false);
    }
  };
  // eslint-disable-next-line no-shadow
  const addTempList: (id: number, name: string) => void = (id, name) => {
    const isAlreadyAdded = tempList.some((item) => item.id === id);

    if (isAlreadyAdded) {
      Swal.fire({
        title: '이미 추가된 항목입니다.',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      return;
    }

    if (tempList.length >= 12) {
      Swal.fire({
        title: '더 이상 재료를 추가할 수 없습니다.',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
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
        ingredient_amount: 1,
        unit: { id: 1, name: '개' },
      },
    ];
    setTempList(updatedList);
  };

  const modifyCustomCocktail = async () => {
    try {
      if (
        customName &&
        customSummary &&
        customComment &&
        customRecipe &&
        customRecipe.trim() !== '' &&
        filteredList.length > 0
      ) {
        const postInput = {
          customName,
          customSummary,
          customComment,
          customRecipe: changedRecipe,
          open: isPublic ? 'True' : 'False',
          customIngredientList: filteredList,
        };

        const formData = new FormData();
        // if (newImage === null) {
        //   formData.append('image', JSON.stringify(null));
        // } else {
        //   formData.append('image', newImage);
        // }
        if (newImage !== null) {
          formData.append('image', newImage);
        } else {
          // newImage가 null인 경우 FormData에 이미지 키에 null 값을 추가
          formData.append('image', JSON.stringify(null));
        }
        formData.append(
          'CustomModifyReqDto',
          new Blob([JSON.stringify(postInput)], { type: 'application/json' }),
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customs/${customId}`,
          {
            method: 'PATCH',
            headers: { authorization },
            body: formData,
          },
        );
        if (response.ok) {
          // eslint-disable-next-line no-alert
          router.push(`/cocktail/detail?id=${customId}`);
        } else {
          // eslint-disable-next-line no-console
          throw new Error('Failed to fetch data');
          // eslint-disable-next-line no-console
        }
      } else {
        // if (!customImage) {
        //   alert('커스텀 칵테일 이미지를 업로드해주세요.');
        // } else

        if (!customName) {
          Swal.fire({
            title: '커스텀 칵테일 이름을 작성해주세요.',
            icon: 'warning',
            confirmButtonColor: '#ff7169',
          });
        } else if (!customSummary) {
          Swal.fire({
            title: '커스텀 칵테일 한 줄 요약(summary)을 작성해주세요.',
            icon: 'warning',
            confirmButtonColor: '#ff7169',
          });
        } else if (!customComment) {
          Swal.fire({
            title: '커스텀 칵테일 간단한 설명(comment)를 작성해주세요.',
            icon: 'warning',
            confirmButtonColor: '#ff7169',
          });
        } else if (!customRecipe || customRecipe.trim() === '') {
          Swal.fire({
            title: '커스텀 칵테일 레시피를 작성해주세요.',
            icon: 'warning',
            confirmButtonColor: '#ff7169',
          });
        } else if (filteredList.length < 1) {
          Swal.fire({
            title: '커스텀 칵테일 재료를 추가해주세요.',
            icon: 'warning',
            confirmButtonColor: '#ff7169',
          });
        }
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
              커스텀 칵테일 이름
              <span className={styles['divide-line']}>&nbsp;&nbsp;&nbsp;|</span>
            </div>

            <div className={styles.explain}>&nbsp;&nbsp; {name}</div>
          </div>

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
                text="커스텀 칵테일 수정"
                btnStyle="full-point"
                handleOnClick={modifyCustomCocktail}
              />
            </div>
          </div>
        </div>
        {/* <button type="button" onClick={confirmData}>
          저장된 데이터 확인
        </button> */}
        <div className={styles['inner-container']}>
          <div className={styles.space}>
            <CustomCocktailImageUpload
              handleImageProps={handleImageProps}
              uploadedImage={customImage}
            />
            <div className={styles['input-container']}>
              <div className={styles.inputs}>
                <CustomCocktailInput
                  max={15}
                  placeText="커스텀 칵테일 이름을 입력해주세요"
                  // defaultValue={name}
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
            <CustomCocktailAddIngredient
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
