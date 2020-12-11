import styled from "styled-components";
import SearchBar from "./components/SearchBar/SearchBar";
// import PreviewPane from "./components/PreviewPane/PreviewPane";
import ResultsList from "./components/ResultsList/ResultsList";
import { useEffect, useState } from "react";
import { GoLinkResult } from "./types";
const { ipcRenderer } = window.require("electron");

const Wrapper = styled.div`
  display: grid;
  height: 600px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 56px 1fr;
  grid-template-areas:
    "searchbar searchbar"
    "results results";
  div,
  button,
  input,
  h1,
  h2,
  h3,
  p,
  span {
    font-family: "Charlie Display";
    font-size: 1rem;
  }
  pointer-events: "none";
`;

export function App() {
  const [index, setIndex] = useState(0);

  const [results, setResults] = useState<GoLinkResult[]>([
    { goLink: "", url: "" },
  ]);

  const [ghostText, setGhostText] = useState("");

  const max = results.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const goNextLink = () => {
    if (index >= max - 1) {
      setIndex(() => {
        const index = 0;
        setGhostText(results.length ? results[index].goLink.slice(3) : "");
        return 0;
      });
    } else {
      setIndex((prev) => {
        const index = prev + 1;
        setGhostText(results.length ? results[index].goLink.slice(3) : "");
        return index;
      });
    }
  };

  const goPrevLink = () => {
    if (index > 0) {
      setIndex((prev) => {
        const index = prev - 1;
        setGhostText(results.length ? results[index].goLink.slice(3) : "");
        return index;
      });
    } else {
      setIndex(() => {
        const index = max - 1;
        setGhostText(results.length ? results[index].goLink.slice(3) : "");
        return index;
      });
    }
  };

  const handleOnKeyDown = (e: any) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      goPrevLink();
    } else if (e.keyCode === 40) {
      e.preventDefault();
      goNextLink();
    } else if (e.keyCode === 9) {
      e.preventDefault();
      goNextLink();
    }
  };

  const handleOnEnter = (e: any, url: string | null, callback: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (url) ipcRenderer.send("open-window", url);
      ipcRenderer.send("hide-window");
      callback();
    } else if (e.keyCode === 27) {
      ipcRenderer.send("hide-window");
      callback();
    }
  };

  const handleOnButtonClick = (_e: any, url: string | null) => {
    ipcRenderer.send("open-window", url);
  };

  return (
    <div
      onKeyDown={handleOnKeyDown}
      onBlur={() => {
        ipcRenderer.send("hide-window");
      }}
    >
      <Wrapper>
        <SearchBar
          ghostText={ghostText}
          setGhostText={setGhostText}
          setResults={setResults}
          currentValue={results[index] ? results[index].goLink : null}
          onKeyDown={handleOnEnter}
          onButtonClick={handleOnButtonClick}
          setIndex={setIndex}
        />
        <ResultsList results={results} index={index} />
        {/* <PreviewPane /> */}
      </Wrapper>
    </div>
  );
}
