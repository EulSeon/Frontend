import { defaultInstance } from '../utils/instance';

// 유저 정보(유저 정보 + 유저 주식 정보) 가져오기
export const getUserInfo = async (roomCode: string) => {
  try {
    const { data, status } = await defaultInstance.get(`/users/${roomCode}`);
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

// 종목 리스트 가져오기
export const getStockList = async (roomCode: string) => {
  try {
    const { data, status } = await defaultInstance.get(
      `/stocks?pwd=${roomCode}`
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

// 뉴스 리스트 가져오기
export const getNewsList = async (roomCode: string) => {
  try {
    const { data, status } = await defaultInstance.get(
      `/stocks/news?pwd=${roomCode}`
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

interface InfoProps {
  purchase_num: number; // 주식 구매 개수
  round_num: number; // 현재 라운드
  pwd: string; // 방코드
}

// 매수하기
export const purchaseStock = async (id: number, info: InfoProps) => {
  try {
    const { data, status } = await defaultInstance.post(`/stocks/${id}`, info);
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};

interface SellProps {
  sell_num: number; // 주식 구매 개수
  pwd: string; // 방코드
}

// 매도하기
export const _sellStock = async (id: number, info: SellProps) => {
  try {
    const { data, status } = await defaultInstance.delete(`/stocks/${id}`, {
      data: info,
    });
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};
