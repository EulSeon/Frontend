import { atom } from 'recoil';

// 네비게이션 바 선택된 값
export const navbarState = atom<string>({
  key: 'navbarState',
  default: 'wallet',
});
