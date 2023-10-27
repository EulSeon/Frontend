/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import convertSecondsToMinute from '@utils/convertSecondsToMinute';
import { useRecoilState } from 'recoil';
import { roomSet } from '../states/roomSetting';

interface SelectProps {
  title?: string;
  set: {
    start: number;
    count: number;
    standard: number;
  };
  defaultValue: string;
}

function Select_({
  title,
  set: { start, count, standard },
  defaultValue,
}: SelectProps) {
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [selected, setSelected] = useState<string>(
    defaultValue ? defaultValue : ''
  ); // 선택된 option
  const [currentSelectedVal, setCurrentSelectedVal] = useState<
    number | undefined
  >(undefined); // 선택된 option의 실제로 사용될 값
  const [roomSetting, setRoom] = useRecoilState(roomSet);

  useEffect(() => {
    // 이미 값이 저장되어있는 경우에는 값이 초기화될 수도 있기 때문에 return
    if (roomSetting.round_num && currentSelectedVal === undefined) return;
    if (roomSetting.time_limit && currentSelectedVal === undefined) return;
    if (roomSetting.seed && currentSelectedVal === undefined) return;

    switch (title) {
      case '라운드':
        setRoom((pre) => ({
          ...pre,
          round_num: currentSelectedVal,
        }));
        break;
      case '제한시간':
        setRoom((pre) => ({
          ...pre,
          time_limit: currentSelectedVal,
        }));
        break;
      case '시드머니':
        setRoom((pre) => ({
          ...pre,
          seed: currentSelectedVal,
        }));
        break;
      default:
        break;
    }
  }, [currentSelectedVal]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Select layout을 제외한 부분을 클릭했을 경우 selected가 안 보이도록 설정
      if (
        !selectRef.current ||
        !selectRef.current.contains(e.target as Document)
      ) {
        setSelectedVisible(false);
      }
    };
    document.addEventListener('click', handleOutsideClick, true);
    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [selectRef]);

  // select 선택했을 경우 해당 값으로 변경
  const onClickSelectValue = (
    e: React.MouseEvent<HTMLLIElement>,
    value: number
  ) => {
    const { innerText } = e.target as HTMLLIElement;
    setSelected(innerText);
    if (title === '시드머니') {
      setCurrentSelectedVal(value * 10000);
    } else {
      setCurrentSelectedVal(value);
    }
    setSelectedVisible(false);
  };

  return (
    <SelectLayout ref={selectRef}>
      <Title $visible={title ? true : false}>{title}</Title>
      <Select>
        <SelectBtn
          onClick={() => {
            setSelectedVisible((pre) => !pre);
          }}
          $visible={selectedVisible}
        >
          <div>
            <p>{selected}</p>
            <img src="/icons/select_icon.svg" />
          </div>
        </SelectBtn>
        <SelectOptions $visible={selectedVisible}>
          <Options $visible={selectedVisible}>
            {defaultValue !== '구분'
              ? new Array(count).fill(0).map((_, index) => {
                  const value = start + standard * index;
                  let minute = '0';
                  let seconds = '0';
                  if (title === '제한시간') {
                    const { min, sec } = convertSecondsToMinute(value);
                    minute = min;
                    seconds = sec;
                  }
                  return (
                    <>
                      {title === '제한시간' ? (
                        <li
                          key={index}
                          onClick={(e: any) => {
                            onClickSelectValue(e, value);
                          }}
                        >
                          {minute + ':' + seconds}
                        </li>
                      ) : (
                        <li
                          key={index}
                          onClick={(e: any) => {
                            onClickSelectValue(e, value);
                          }}
                        >
                          {value}
                        </li>
                      )}
                    </>
                  );
                })
              : ['자산별', '수익별'].map((item) => {
                  return (
                    <li
                      key={item}
                      onClick={(e: any) => {
                        onClickSelectValue(e, 0);
                      }}
                    >
                      {item}
                    </li>
                  );
                })}
          </Options>
        </SelectOptions>
      </Select>
    </SelectLayout>
  );
}

const SelectLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media screen and (max-width: 768px) {
    gap: 5px;
  }
`;

const Title = styled.h3<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'block' : 'none')};
  color: #ffffff;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 70px;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Select = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  position: relative;
`;

const SelectBtn = styled.button<{ $visible: boolean }>`
  display: flex;
  border-radius: 7px;
  overflow: hidden;
  background-color: #a7c2e4;
  color: #ffffff;
  cursor: pointer;

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 16px;
    width: 132px;
    height: 30px;
    color: #ffffff;
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    & > p {
      text-align: left;
      width: 100%;
      white-space: nowrap;
    }

    // select 화살표
    & > img {
      transform: rotate(${(props) => (props.$visible ? '180deg' : '0deg')});
      transition: all, 0.5s;
    }
  }

  @media screen and (max-width: 768px) {
    & > div {
      font-size: 1.5rem;

      & > img {
        width: 15px;
      }
    }
  }
`;

const SelectOptions = styled.div<{ $visible: boolean }>`
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  height: auto;
  max-height: 170px;
  list-style: none;
  background-color: #a7c2e4;
  border-radius: 7px;
  position: absolute;
  top: 40px;
  z-index: 1;
  opacity: ${(props) => (props.$visible ? '1' : '0')};
  transition: all, 0.5s;
  pointer-events: ${(props) => (props.$visible ? 'all' : 'none')};
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Options = styled.ul<{ $visible: boolean }>`
  & > li {
    width: 132px;
    padding: 4px 16px;
    color: #ffffff;
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 7px;
      opacity: ${(props) => (props.$visible ? '1' : '0.7')};
      transition: all, 0.5s;
    }
  }

  @media screen and (max-width: 768px) {
    & > li {
      font-size: 1.5rem;
    }
  }
`;

export default Select_;
