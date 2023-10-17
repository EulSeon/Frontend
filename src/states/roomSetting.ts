import { recoilPersist } from 'recoil-persist';
import { atom } from 'recoil';
const { persistAtom } = recoilPersist();

interface RoomSet {
  round_num: number | undefined;
  time_limit: number | undefined;
  seed: number | undefined;
}

// 게임방 세팅 관련 내용
export const roomSet = atom<RoomSet>({
  key: 'roomSet',
  default: {
    round_num: undefined,
    time_limit: undefined,
    seed: undefined,
  },
  effects_UNSTABLE: [persistAtom],
});

// 게임방 버튼 상태
export const currentBtnState = atom<string>({
  key: 'currentBtn',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

// 게임방 버튼 상태
export const systemVisible = atom<boolean>({
  key: 'systemVisible',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
