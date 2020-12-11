import { GoLinkResult } from "../../types";
import ResultsListView from "./ResultsListView";

interface Props {
  results: GoLinkResult[];
  index: number;
}

const ResultsList: React.FC<Props> = (props) => {
  const { results, index } = props;

  return <ResultsListView results={results} current={index} />;
};

export default ResultsList;
