import { Dispatch, SetStateAction } from "react";
import { GoLinkResult } from "../../types";
import SearchBarView from "./SearchBarView";

interface Props {
  currentValue: string | null;
  onKeyDown: (e: any, url: string | null, callback: any) => void;
  onButtonClick: (e: any, url: string | null) => void;
  setIndex: any;
  setResults: Dispatch<SetStateAction<GoLinkResult[]>>;
  ghostText: string;
  setGhostText: any;
}

const SearchBar: React.FC<Props> = (props) => {
  return <SearchBarView {...props} />;
};

export default SearchBar;
