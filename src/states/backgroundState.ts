import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();
import { atom } from 'recoil';

// 라운드 종료 후에 뜨는 배경 상태 (라운드 종료 여부)
export const finishBackgroundState = atom({
  key: 'finishBackgroundState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
