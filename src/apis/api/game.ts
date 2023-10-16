import { defaultInstance } from '../utils/instance';

// 게임방 비밀번호 가져오기
export const getGameRoomPassword = async () => {
  try {
    const { data, status } = await defaultInstance.post(`/rooms`);
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

interface RoomInfo {
  round_num: number;
  time_limit: number;
  seed: number;
}

// 게임방 정보 업데이트하기
export const updateRoomInfo = async (roomPW: string, roomInfo: RoomInfo) => {
  try {
    const { data, status } = await defaultInstance.put(
      `/rooms/${roomPW}`,
      roomInfo
    );
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};
