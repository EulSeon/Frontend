import { atom } from 'recoil';

interface StockModalState {
  visible: boolean;
  buttonState: string | undefined | null; // buy, sell, undefined
}

// 모달창 visible 관련 내용 - 지갑 & 종목
export const stockModalState = atom<StockModalState>({
  key: 'stockModalState',
  default: {
    visible: false,
    buttonState: undefined,
  },
});

interface StockModalVals {
  name: string | undefined;
  pre_round_price: number | undefined;
  cur_round_price: number | undefined;
  info: string | undefined;
}

// 모달창 안에 들어있는 값 관련 내용 - 종목명, 전 라운드 가격, 현 라운드 가격, 안내 멘트
export const stockModalVals = atom<StockModalVals>({
  key: 'stockModalVals',
  default: {
    name: undefined,
    pre_round_price: undefined,
    cur_round_price: undefined,
    info: undefined,
  },
});
