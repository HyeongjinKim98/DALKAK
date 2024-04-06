'use client';

import React, { useEffect } from 'react';
// eslint-disable-next-line import/extensions, import/no-unresolved

import Swal from 'sweetalert2';
import surveyStore from '../../store/surveyStore';
// eslint-disable-next-line import/extensions, import/no-unresolved
import AlcoholSurvey from '@/components/survey/AlcoholSurvey.tsx';
import BaseSurvey from '@/components/survey/BaseSurvey';
import CocktailSurvey from '@/components/survey/CocktailSurvey';
import CompleteSurvey from '@/components/survey/CompleteSurvey';
import InfoSurvey from '@/components/survey/InfoSurvey';
import IngredientSurvey from '@/components/survey/IngredientSurvey';
import OccationSurvey from '@/components/survey/OccationSurvey';
import SweetnessSurvey from '@/components/survey/SweetnessSurvey';
import memberStore from '@/store/memberStore';

export default function Survey() {
  const progress = surveyStore((state) => state.progress);
  const isLoggedIn = memberStore((state) => state.isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        title: '로그인이 필요합니다',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      window.location.replace('/oauth');
      alert('로그인이 필요합니다');
    }
  }, [isLoggedIn]);
  switch (progress) {
    case 0:
      return <InfoSurvey />;
    case 1:
      return <CocktailSurvey />;
    case 2:
      return <OccationSurvey />;
    case 3:
      return <BaseSurvey />;
    case 4:
      return <AlcoholSurvey />;
    case 5:
      return <SweetnessSurvey />;
    case 6:
      return <IngredientSurvey />;
    case 7:
      return <CompleteSurvey />;
    default:
      return <h1>{progress}</h1>;
  }
}
