import allData from "../../golinks.json";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GoLinkResult } from "../../types";
const { ipcRenderer } = window.require("electron");

const compareByUsageCount = (a: any, b: any) => {
  if (a.usageCount < b.usageCount) {
    return 1;
  }
  if (a.usageCount > b.usageCount) {
    return -1;
  }
  return 0;
};

// Sort the whole thing at the start!
(() => {
  (allData as GoLinkResult[]).sort(compareByUsageCount);
})();

const SearchBarWrapper = styled.form`
  display: flex;
  max-width: 100%;
  padding: 0.5rem;
  align-items: center;
  grid-area: searchbar;
  position: relative;
`;

const Button = styled.button`
  border: 0;
  border-radius: 100%;
  height: 2rem;
  width: 2rem;
  padding: 0;
  cursor: pointer;
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:focus {
    background: #dddddd;
    outline: 0;
  }
`;

const Input = styled.input`
  margin-left: 0.25rem;
  padding: 0 0.5rem;
  width: 100%;
  height: 2.125rem;
  border: 2px solid #dddddd;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  &:focus {
    box-shadow: 0 0 5px rgba(82, 122, 190, 0.75);
    border: 2px solid rgba(82, 122, 190, 0.75);
    outline: 0;
  }
`;

const SearchBarGoIcon = () => (
  <svg
    width="23"
    height="34"
    viewBox="0 0 23 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="24"
      height="24"
      transform="translate(0 5)"
      fill="white"
      fill-opacity="0.01"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22 17C22 22.5228 17.5228 27 12 27C6.47715 27 2 22.5228 2 17C2 11.4772 6.47715 7 12 7C17.5228 7 22 11.4772 22 17ZM12.0213 14.005C12.0213 13.7387 12.1265 13.4831 12.314 13.294C12.4067 13.2008 12.517 13.1268 12.6384 13.0763C12.7598 13.0259 12.89 12.9999 13.0215 12.9999C13.153 12.9999 13.2832 13.0259 13.4046 13.0763C13.526 13.1268 13.6363 13.2008 13.729 13.294L16.707 16.289C16.8945 16.4781 16.9997 16.7337 16.9997 17C16.9997 17.2663 16.8945 17.5219 16.707 17.711L13.729 20.706C13.5413 20.8935 13.2868 20.9989 13.0215 20.9989C12.7562 20.9989 12.5017 20.8935 12.314 20.706C12.1265 20.5169 12.0213 20.2613 12.0213 19.995C12.0213 19.7287 12.1265 19.4731 12.314 19.284L13.585 18.005H7.99999C7.44699 18.005 6.99899 17.555 6.99899 17C6.99899 16.445 7.44699 15.995 7.99999 15.995H13.585L12.314 14.716C12.1265 14.5268 12.0213 14.2713 12.0213 14.005Z"
      fill="#42526E"
    />
  </svg>
);

const GhostText = styled.div`
  position: absolute;
  width: 100%;
  height: 2.125rem;
  padding-top: 0.8125rem;
  padding-left: 1.92rem;
  margin-left: 0.25rem;
  border: 2px solid rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0.25);
  z-index: 10;
`;

type Props = {
  currentValue: string | null;
  onKeyDown: (e: any, url: string | null, callback: any) => void;
  onButtonClick: (e: any, url: string | null) => void;
  setIndex: any;
  setResults: Dispatch<SetStateAction<GoLinkResult[]>>;
  ghostText: string;
  setGhostText: any;
};

type FormInput = {
  searchValue: string;
};

const formatLink = (dataList: GoLinkResult[]) => {
  return dataList.map((data) => ({
    ...data,
    goLink: "go/" + data.goLink.slice(24),
  }));
};

const getLinks = (searchValue: string) => {
  let data: GoLinkResult[] = [];
  for (const obj of allData as GoLinkResult[]) {
    if (obj.goLink.slice(24).indexOf(searchValue) === 0) {
      data.push(obj);
    }

    if (data.length > 10) {
      break;
    }
  }

  data = formatLink(data);

  return data;
};

const SearchBarView: React.FC<Props> = ({
  currentValue,
  onKeyDown,
  onButtonClick,
  setResults,
  setIndex,
  ghostText,
  setGhostText,
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<FormInput>();

  const watchSearchValue = watch("searchValue");

  useEffect(() => {
    if (!watchSearchValue || watchSearchValue.length === 0) {
      setResults([]);
      setIndex(0);
      setGhostText("");
      return;
    }

    let links = getLinks(watchSearchValue);

    if (links.length === 0 || links[0] === undefined) {
      setResults([]);
      setIndex(0);
      setGhostText("");
      return;
    }

    links = [
      ...new Set<any>(links.map((el: any) => JSON.stringify(el))),
    ].map((e) => JSON.parse(e));

    setResults(links);
    setIndex(0);

    // Ghost text
    if (watchSearchValue) {
      const substring = links[0].goLink.slice(3, 3 + watchSearchValue.length);
      if (substring === watchSearchValue) {
        setGhostText(links[0].goLink.slice(3));
      } else {
        setGhostText("");
      }
    }

    if (watchSearchValue) {
      ipcRenderer.send("enlarge-window");
    } else {
      ipcRenderer.send("minimize-window");
    }
  }, [setGhostText, setIndex, setResults, watchSearchValue]);

  const onSubmit = () => {};

  return (
    <SearchBarWrapper
      onKeyDown={(e) => {
        onKeyDown(e, currentValue, () => setValue("searchValue", null));
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <span>go/</span>
      <Input type="text" name="searchValue" ref={register} autoFocus={true} />
      <GhostText>{ghostText}</GhostText>
      <Button onClick={(e) => onButtonClick(e, currentValue)}>
        <SearchBarGoIcon />
      </Button>
    </SearchBarWrapper>
  );
};

export default SearchBarView;
