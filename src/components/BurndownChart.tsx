import React, { useCallback, useEffect, useRef, useState } from "react";
import { Figure } from "react-bootstrap";

interface Props {
  className?: string,
  height: number
}

const BurndownChart = (props: Props) => {

  // Maintain references to container and main SVG element.
  const container = useRef<(HTMLElement & Figure<"figure">) | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);

  // Ensure responsive chart width.
  const [width, setWidth] = useState<number>(0);
  
  const handleResize = useCallback(() => {
    if (container.current!.offsetWidth !== width) {
      setWidth(container.current!.offsetWidth);
    }
  }, [width]);

  useEffect(() => {
    setWidth(container.current!.offsetWidth);
    window.addEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <Figure ref={container} className={`${props.className} figure-img d-block`}>
      <svg ref={svg} height={props.height} width={width} viewBox={`0 0 ${width} ${props.height}`}>
        <g className="axes">
          <g className="x-axis"></g>
          <g className="y-axis"></g>
        </g>
        <g className="bars"></g>
      </svg>
    </Figure>
  );
};

export default BurndownChart;