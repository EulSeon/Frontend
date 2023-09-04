import { defaultInstance } from '../utils/instance';

// 게임방 비밀번호 가져오기
export const getGameRoomPassword = async () => {
  try {
    const { data, status } = await defaultInstance.get(`/roomCode`);
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { message: e.response.data.message, status: e.response.status };
  }
};
