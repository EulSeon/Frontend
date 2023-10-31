/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultInstance } from '../utils/instance';

// 게임방 비밀번호 가져오기
export const getGameRoomPassword = async () => {
  try {
    const { data, status } = await defaultInstance.post(`/rooms`);
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
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
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 503,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

interface StudentInfo {
  name: string; // 이름
  profile_num: number; // 프로필
}

// 학생들 정보 생성 후 게임방에 참여시키기
export const participateGameRoom = async (
  roomPW: string,
  studentInfo: StudentInfo
) => {
  try {
    const { data, status } = await defaultInstance.post(
      `/users/${roomPW}`,
      studentInfo
    );
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

// 게임방 나가기
export const leaveGameRoom = async (roomPW: string) => {
  try {
    const { data, status } = await defaultInstance.delete(`/users/${roomPW}`);
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

// 게임방 다음 라운드로 넘어가기
export const goNextRound = async (roomPW: string) => {
  try {
    const { data, status } = await defaultInstance.put(`/rooms/${roomPW}/next`);
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

// 게임 결과 조회하기
export const checkGameResult = async (
  roomPW: string,
  round: number,
  opt: number
) => {
  try {
    const { data, status } = await defaultInstance.get(
      `/rooms/${roomPW}/result?round=${round}&opt=${opt}`
    );
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

interface SaveGameResult {
  round_num: number;
}

// 게임 결과 저장하기
export const saveGameResult = async (roomPW: string, round: SaveGameResult) => {
  try {
    console.log(round);
    const { data, status } = await defaultInstance.post(
      `/rooms/${roomPW}/result`,
      round
    );
    return { data, status };
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      return {
        status: 500,
        error: '네트워크 에러발생',
      };
    }
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};
