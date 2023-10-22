import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();
import { atom } from 'recoil';

interface NewsList {
  descriptions: string[]; // 뉴스 내용
  isGood: number[]; // 호황 여부
}

// 뉴스 리스트
export const newsList = atom<NewsList>({
  key: 'newsList',
  default: {
    descriptions: [],
    isGood: [],
  },
  effects_UNSTABLE: [persistAtom],
});
