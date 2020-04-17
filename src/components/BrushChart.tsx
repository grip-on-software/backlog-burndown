import { axisBottom, brushX, event, scaleTime, select, Selection, Transition } from 'd3';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';

import { configSelector, setRange } from '../slices/config';

interface Props {
  className?: string,
  height: number,
  margin?: {
    bottom?: number,
    left?: number,
    right?: number,
    top?: number,
  }
}

const BrushChart = (props: Props) => {

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

  // Define scales, axes, and draw chart.
  const dispatch = useDispatch();
  const { bounds, project, range } = useSelector(configSelector);

  const scale = {
    x: useMemo(() => scaleTime()
      .domain(bounds)
      .rangeRound([props.margin?.left || 0, width - (props.margin?.right || 0)]),
    [bounds, props.margin, width]),
  };

  const axis = {
    x: useMemo(() => (g: Transition<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(0,${props.height - (props.margin?.bottom || 0)})`)
        .call(g => g
          .call(axisBottom(scale.x)
            .ticks(width / props.height)
            .tickSize(-props.height + (props.margin?.top || 0) + (props.margin?.bottom || 0)))
          .call(g => g.selectAll(".domain")
            .attr("fill", "#ddd")
            .attr("stroke", null))
          .call(g => g.selectAll(".tick line")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.5))),
      [props.height, props.margin, scale.x, width]),
  };

  const handleBrush = useCallback(() => {
    if (!project) return;
    try {
      const region: [number, number] = event.selection.map((r: number) => scale.x.invert(r).getTime());
      if (range && range[0] === region[0] && range[1] === region[1]) return;
      dispatch(setRange(region));
    } catch (error) {
      if (range) dispatch(setRange(null));
    }
  }, [dispatch, project, range, scale]);

  const brush = useMemo(() => brushX()
    .extent([
      [(props.margin?.left || 0), (props.margin?.top || 0)],
      [width - (props.margin?.right || 0), props.height - (props.margin?.bottom || 0)]
    ])
    .on("end", handleBrush),
  [handleBrush, props.height, props.margin, width]);

  // Update chart.
  useEffect(() => {
    if (!svg.current) return;
    const chart = select(svg.current);

    // Update axes.
    (chart.select(".x-axis") as Selection<SVGGElement, unknown, null, undefined>)
      .transition()
      .duration(250)
      .call(axis.x);

    // Redraw brush.
    (chart.select(".brush") as Selection<SVGGElement, unknown, null, undefined>)
      .call(brush)
      .call(brush.move, range ? range.map(r => scale.x(r)) : null);
  }, [axis, brush, range, scale]);

  return (
    <Figure ref={container} className={`${props.className} figure-img d-block`}>
      <svg className="chart chart-brush" ref={svg} height={props.height} width={width} viewBox={`0 0 ${width} ${props.height}`}>
        <g className="axes">
          <g className="x-axis"></g>
        </g>
        <g className="brush"></g>
      </svg>
    </Figure>
  );
};

export default BrushChart;