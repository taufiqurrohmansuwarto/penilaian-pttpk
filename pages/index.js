import * as React from "react";
import { Button } from "semantic-ui-react";

export default function Home() {
  const handleBar = () => {
    alert("etst");
  };

  const handleClick = () => {
    alert("etst");
  };

  const test = (arr) => {
    return arr.map((t) => !!t?.x);
  };

  return (
    <div>
      <p>lorem</p>
      <Button active animated onClick={handleClick}>
        something
      </Button>
      <h1>hello world</h1>
    </div>
  );
}

// karena kita akan
