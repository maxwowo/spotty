import { MenuGroup, Section } from "@atlaskit/menu";
import styled from "styled-components";
import { FC } from "react";
import { GoLinkResult } from "../../types";

const Wrapper = styled.div`
  grid-area: results;
  background: #e9e9e9;
  min-height: 100%;
`;

const Button = styled.button`
  width: full;
  display: block;
  border: 0;
  padding: 1rem;
  background: #dad9d9;
  width: 100%;
  text-align: left;
  color: blue;

  &:disabled {
    color: black;
    background: none;
    outline: 0;
  }
`;

interface Props {
  results: GoLinkResult[];
  current: number;
}

const ResultsListView: FC<Props> = (props) => {
  const { results, current } = props;
  // Todo: Move this out. This is a hack, once we have backend we will fix this

  return (
    <Wrapper>
      <MenuGroup>
        <Section>
          {results.map((val, index) => (
            <Button
              id={index.toString()}
              key={val.goLink + index.toString()}
              disabled={index !== current}
            >
              {val.goLink}
            </Button>
          ))}
        </Section>
      </MenuGroup>
    </Wrapper>
  );
};

export default ResultsListView;
