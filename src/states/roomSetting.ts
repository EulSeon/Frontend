import { atom } from 'recoil';

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
});
