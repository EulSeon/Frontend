import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();
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
  id: number | undefined; // 회사 id
  kind: string; // 지갑(wallet) 메뉴에서 클릭됐는지 종목(stock) 메뉴에서 클릭됐는지
  company_name: string | undefined; // 회사명
  inStock: number | undefined; // 보유중인 주식
  first_menu_price: number; // 평균 매입가/전 라운드 가격
  second_menu_price: number; // 현 라운드 가격
  info: string | undefined; // 안내 문구
  difference: number; // 가격 차이
}

// 모달창 안에 들어있는 값 관련 내용 - 종목명, 전 라운드 가격, 현 라운드 가격, 안내 멘트
export const stockModalVals = atom<StockModalVals>({
  key: 'stockModalVals',
  default: {
    id: undefined,
    kind: 'wallet',
    company_name: undefined,
    inStock: undefined,
    first_menu_price: 0,
    second_menu_price: 0,
    info: undefined,
    difference: 0,
  },
  effects_UNSTABLE: [persistAtom],
});
