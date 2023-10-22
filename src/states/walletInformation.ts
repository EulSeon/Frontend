import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();
import { atom } from 'recoil';

interface News {
  description: string; // 뉴스 내용
  isGood: number; // 호황 여부
  com_name: string; // 회사 이름
}

// 뉴스 리스트
export const newsList = atom<Array<News>>({
  key: 'newsList',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
