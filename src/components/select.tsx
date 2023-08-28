import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface SelectProps {
  title?: string;
  set: {
    start: number;
    count: number;
    standard: number;
  };
}

function Select_({ title, set: { start, count, standard } }: SelectProps) {
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [selected, setSelected] = useState<string>('Select');

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
  const onClickSelectValue = (e: React.MouseEvent<HTMLLIElement>) => {
    const { innerText } = e.target as HTMLLIElement;
    setSelected(innerText);
    setSelectedVisible(false);
  };

  return (
    <SelectLayout ref={selectRef}>
      <Title visible={title ? true : false}>{title}</Title>
      <Select>
        <SelectBtn
          onClick={() => {
            setSelectedVisible((pre) => !pre);
          }}
          visible={selectedVisible}
        >
          <div>
            <p>{selected}</p>
            <img src="/icons/select_icon.svg" />
          </div>
        </SelectBtn>
        <SelectOptions visible={selectedVisible}>
          <Options visible={selectedVisible}>
            {new Array(count).fill(0).map((_, index) => {
              return (
                <li key={index} onClick={onClickSelectValue}>
                  {start + standard * index}
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
  gap: 16px;
`;

const Title = styled.h3<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  color: #ffffff;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 70px;
`;

const Select = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  position: relative;
`;

const SelectBtn = styled.button<{ visible: boolean }>`
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
    gap: 32px;
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
    }

    // select 화살표
    & > img {
      transform: rotate(${(props) => (props.type ? '180deg' : '0deg')});
      transition: all, 0.5s;
    }
  }
`;

const SelectOptions = styled.div<{ visible: boolean }>`
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  height: 170px;
  list-style: none;
  background-color: #a7c2e4;
  border-radius: 7px;
  position: absolute;
  top: 40px;
  z-index: 1;
  opacity: ${(props) => (props.visible ? '1' : '0')};
  transition: all, 0.5s;
  pointer-events: ${(props) => (props.visible ? 'all' : 'none')};
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Options = styled.ul<{ visible: boolean }>`
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
      opacity: ${(props) => (props.visible ? '1' : '0.7')};
      transition: all, 0.5s;
    }
  }
`;

export default Select_;
