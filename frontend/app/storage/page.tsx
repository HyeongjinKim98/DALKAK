'use client';

import { useEffect } from 'react';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';

import Swal from 'sweetalert2';

import styles from './refrigerator.module.scss';

import AboveRefridgerator from '@/components/store/AboveRefridgerator';
import MemoContainer from '@/components/store/MemoContainer';
import RefridgeratorContainer from '@/components/store/RefridgeratorContainer';
import memberStore from '@/store/memberStore';
import useRefrigeratorStore from '@/store/refrigeratorStore';

export default function Page() {
  const { setRefgList, setMemoList, memoToRefr, refrToMemo } =
    useRefrigeratorStore();

  const isLoggedIn = memberStore((state) => state.isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        title: '로그인이 필요합니다.',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      window.location.replace('/oauth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRefgList();
    setMemoList();
  }, [setRefgList, setMemoList]);

  /** 재료를 드래그 해서 옮길 때 실행되는 함수 */
  const onDragEnd = (result: DropResult): void => {
    if (result.destination?.droppableId !== result.source?.droppableId) {
      if (result.destination?.droppableId === 'refr') {
        memoToRefr(result.source.index);
      } else {
        refrToMemo(result.source.index);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <div className={styles['refrigerator-container']}>
          <AboveRefridgerator />
          <RefridgeratorContainer />
        </div>
        <div className={styles['memo-container']}>
          <MemoContainer />
        </div>
      </div>
    </DragDropContext>
  );
}
