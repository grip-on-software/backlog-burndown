import { Selection, axisBottom, axisLeft, max, min, scaleLinear, scaleTime, select, stack, stackOffsetNone, Transition } from 'd3';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { burndownSelector } from "../slices/burndown";
import { stacksSelector } from '../slices/stacks';

import { Figure } from "react-bootstrap";

interface Props {
  className?: string,
  height: number
  margin?: {
    bottom?: number,
    left?: number,
    right?: number,
    top?: number,
  }
}

const features = {
  keys: ["added", "reestimatedHigher", "unestimated", "remaining", "reestimatedLower", "discarded", "completed"],
  labels: {
    added: "Added work",
    completed: "Completed work",
    discarded: "Discarded work",
    reestimatedHigher: "Work reestimated higher",
    reestimatedLower: "Work reestimated lower",
    remaining: "Remaining work",
    unestimated: "Unestimated work",
  }
};

const stackOffsetBurndown = (s: any[], o: number[]) => {
  for (let i = 0; i < s.length; ++i) {
    for (let j = 0; j < s[o[i]].length; ++j) {
      if (0 === i) {
        for (let k = i; k < 3; k++) {
          for (let l = j + 1; l < s[o[i]].length; l++) {
            s[o[i]][j][0] += s[o[k]][l][1];
          }
        }
      } else {
        s[o[i]][j][0] = s[o[i-1]][j][1];
      }
      s[o[i]][j][1] += s[o[i]][j][0];
    }
  }
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

  const { isAligned, range } = useSelector(burndownSelector);
  const { stacks } = useSelector(stacksSelector);
  const bounds = stacks.length
    ? [stacks[0].timeFrame.startTime, stacks[stacks.length-1].timeFrame.endTime]
    : [0,0];
  
  const series = useMemo(() => {
    return stack()
      .keys(features.keys)
      .offset((s, o) => isAligned ? stackOffsetNone(s,o) : stackOffsetBurndown(s,o))
      (stacks.map(stack => stack.bars))
  }, [isAligned, stacks]);

  const scale = {
    x: useMemo(() => scaleTime()
        .domain(range || bounds)
        .rangeRound([props.margin?.left || 0, width - (props.margin?.right || 0)]),
      [bounds, props.margin, range, width]),
    y: useMemo(() => scaleLinear()
        .domain(range
          ? [
              (s => 
                (min(s[0].filter((e, i) =>
                  stacks[i].timeFrame.endTime > range[0] &&
                  stacks[i].timeFrame.startTime < range[1]),
                  d => d[0]) || 0)
              )(series),
              (s => 
                (max(s[series.length-1].filter((e, i) => 
                  stacks[i].timeFrame.endTime > range[0] &&
                  stacks[i].timeFrame.startTime < range[1]),
                  d => d[0]) || 0)
              )(series)
            ]
          : [0, (s => max(s, d => max(d, d => d[1])) || 0)(series)])
        .rangeRound([props.height - (props.margin?.bottom || 0), (props.margin?.top || 0)]),
      [props.height, props.margin, range, stacks, series]),
  };

  const axis = {
    x: useMemo(() => (g: Transition<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(0,${props.height - (props.margin?.bottom || 0)})`)
        .call(g => g
          .call(axisBottom(scale.x)
            .ticks(0))
          .call(g => g.selectAll(".domain").remove())),
      [props.height, props.margin, scale.x]),
    y: useMemo(() => (g: Transition<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(${(props.margin?.left || 0)},0)`)
        .attr("opacity", 0.25)
          .call(axisLeft(scale.y)
            .tickSize(-width + (props.margin?.left || 0) + (props.margin?.right || 0)))
          .call(g => g.selectAll(".domain").remove()),
      [props.margin, scale.y, width]),
  };

  useEffect(() => {
    if (!svg.current) return;
    const chart = select(svg.current);
    
    // Update axes.
    (chart.select(".x-axis") as Selection<SVGGElement, unknown, null, undefined>)
      .transition()
      .duration(250)
      .call(axis.x);
    (chart.select(".y-axis") as Selection<SVGGElement, unknown, null, undefined>)
      .transition()
      .duration(250)
      .call(axis.y);

    chart.select(".bars")
      .selectAll("g")
      .data(series)
      .join("g")
        .attr("class", d => d.key)
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .transition()
        .duration(250)
        .attr("class", (d, i) => stacks[i].timeFrame.forecast ? "bar forecast" : "bar")
        .attr("x", (d, i) => scale.x(stacks[i].timeFrame.startTime))
        .attr("y", d => scale.y(d[1]))
        .attr("width", (d, i) => scale.x(stacks[i].timeFrame.endTime) - scale.x(stacks[i].timeFrame.startTime))
        .attr("height", d => scale.y(d[0]) - scale.y(d[1]));

  }, [axis, scale, series, stacks]);

  return (
    <Figure ref={container} className={`${props.className} figure-img d-block`}>
      <svg className="chart chart-burndown" ref={svg} height={props.height} width={width} viewBox={`0 0 ${width} ${props.height}`}>
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