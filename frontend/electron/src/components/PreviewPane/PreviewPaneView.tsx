import styled from "styled-components";

const Wrapper = styled.div`
  grid-area: preview;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-transform: uppercase;
`;

const PreviewPaneView: React.FC = () => <Wrapper>No Preview</Wrapper>;

export default PreviewPaneView;
