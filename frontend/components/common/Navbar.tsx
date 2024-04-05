'use client';

import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';
import NavbarTopRank from './NavbarTopRank';
import { Logout } from '@/apis/Auth';
import logo from '@/public/assets/imgs/dalkak_logo.png';
import authStore from '@/store/authStore';
import memberStore from '@/store/memberStore';
import useRefrigeratorStore from '@/store/refrigeratorStore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material';

// import memberStore from '@/store/memberStore';

export default function Navbar() {
  const pathName = usePathname();
  const isLoggedIn = memberStore((state) => state.isLoggedIn);
  const clearAll = memberStore((state) => state.clearAll);
  const clearTokens = authStore((state) => state.clearTokens);
  const [userNickname, setUserNickname] = useState('');
  const { clearRefgMemo } = useRefrigeratorStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const LogoutFunction = async () => {
    try {
      const response = await Logout();
      clearAll();
      clearTokens();
      clearRefgMemo();
      if (response.status === 200 || response.status === 401) {
        window.location.replace('/');
      }
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    setUserNickname(memberStore.getState().nickname);
  }, []);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <Link href="/">
              <Image src={logo} width={140} height={100} alt="logo" />
            </Link>
          </div>
          <div className={styles.pages}>
            <Link href={isLoggedIn ? '/cocktail' : '/oauth'}>
              <div
                className={
                  pathName?.startsWith('/cocktail') ? styles.active : ''
                }
              >
                칵테일 목록
              </div>
            </Link>

            <Link href={isLoggedIn ? '/storage' : '/oauth'}>
              <div
                className={
                  pathName?.startsWith('/storage') ? styles.active : ''
                }
              >
                냉장고
              </div>
            </Link>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.fix}>
            현재 가장 인기 있는 칵테일&nbsp;&nbsp;|&nbsp;&nbsp;
          </div>
          <div>
            <NavbarTopRank />
          </div>
        </div>
        <div className={styles.right}>
          {isLoggedIn ? (
            <>
              <div className={styles.nickname}>{userNickname}</div>님 반가워요!
              <button
                className={styles.dropdown}
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </button>
              {/* <button
                className={styles.btn}
                type="button"
                onClick={() => LogoutFunction()}
              >
                로그아웃
              </button> */}
            </>
          ) : (
            <div className={styles.needToLogin}>로그인이 필요해요</div>
          )}
          {/* <Link href="/member">
            <HomeIcon />
          </Link> */}
        </div>
      </div>
      {isOpen && (
        <div className={styles.info}>
          <button
            type="button"
            onClick={() => {
              router.push('/member');
              setIsOpen(false);
            }}
          >
            회원정보
          </button>
          <button type="button" onClick={() => LogoutFunction()}>
            로그아웃
          </button>
        </div>
      )}
    </>
  );
}
