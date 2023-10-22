import { defaultInstance } from '../utils/instance';

// 뉴스 리스트 가져오기
export const getNewsList = async () => {
  try {
    const { data, status } = await defaultInstance.get(`/stocks/news`);
    return { data, status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      status: e.response.status,
      error: e.response.data.error,
    };
  }
};
