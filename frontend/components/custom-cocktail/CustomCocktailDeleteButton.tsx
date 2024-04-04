'use client';

import React from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';

import styles from './CustomCocktailModifyButton.module.scss';
import authStore from '@/store/authStore';

interface Props {
  customId: number;
  cocktailId: number;
}

// const Swal = require('sweetalert2');

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

export default function CustomCocktailDeleteButton({
  customId,
  cocktailId,
}: Props) {
  const router = useRouter();

  const DeleteClick = async () => {
    // eslint-disable-next-line no-restricted-globals
    // const confirmed = confirm('정말로 삭제하시겠습니까?');

    Swal.fire({
      title: '커스텀 칵테일을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/customs/${customId}`,
            {
              method: 'Delete',
              headers: {
                authorization,
              },
            },
          );
          if (response.ok) {
            router.push(`/cocktail/customs?id=${cocktailId}`);
          } else {
            Swal.fire({
              title: '커스텀 레시피 삭제를 실패하였습니다.',
              icon: 'error',
            });
          }
        } catch (error) {
          /* empty */
        }

        Swal.fire({
          title: '커스텀 레시피가 삭제되었습니다.',
          icon: 'success',
        });
      }
    });
  };

  return (
    <div>
      <IconButton type="button" onClick={DeleteClick}>
        <DeleteOutlineIcon className={styles.icons} /> &nbsp;삭제
      </IconButton>
    </div>
  );
}
