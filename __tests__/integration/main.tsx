import { Canvas, CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SVGRenderer } from '@antv/g-svg';
import { Select, Tag } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as cases from './charts';

const { Option } = Select;

const casesName = Object.keys(cases);
const renderers = {
  svg: new SVGRenderer(),
  canvas: new CanvasRenderer(),
} as const;

type Renderer = keyof typeof renderers;

const View: React.FC = () => {
  const canvasRef = useRef<Canvas>();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const [canvasReady, setCanvasReady] = useState(false);
  const [renderer, setRenderer] = useState<Renderer>((searchParams.get('renderer') as Renderer) || 'svg');
  const [caseList, setCaseList] = useState<string[]>(casesName);
  const [currCase, setCurrCase] = useState(searchParams.get('case') || caseList[0]);
  const [tags, setTags] = useState<string[]>([]);

  const getRenderer = useCallback(() => {
    return renderers[renderer];
  }, [renderer]);

  const renderCase = (name: string) => {
    if (!canvasRef.current || !casesName.includes(name)) return;
    canvasRef.current.removeChildren();
    const node = cases[name]();
    const title = cases[name].tags || [name];
    document.title = title.join('-');
    setTags(title);
    canvasRef.current.appendChild(node);
  };

  const searchCase = (keyword: string) => {
    setCaseList(Object.keys(cases).filter((name) => name.toLowerCase().includes(keyword.toLowerCase())));
  };

  const setSearch = (pair: { [key: string]: string }) => {
    const params = {
      case: currCase,
      renderer,
      ...pair,
    };
    const search = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    window.history.pushState({ action: 'update' }, params.case, `?${search}`);
  };

  const connectToPlugins = (canvas: Canvas) => {
    if (!(window as any).__g_instances__) {
      (window as any).__g_instances__ = [];
    }
    (window as any).__g_instances__.push(canvas);
  };

  const onKeyDown = (evt: KeyboardEvent) => {
    const { key } = evt;
    const prevKeys = ['ArrowLeft', 'ArrowUp'];
    const nextKeys = ['ArrowRight', 'ArrowDown'];
    const isValidIndex = (index: number) => index >= 0 && index < casesName.length;

    setCurrCase((prevCase) => {
      const currIndex = casesName.indexOf(prevCase);
      let index = currIndex;
      if (prevKeys.includes(key)) index -= 1;
      if (nextKeys.includes(key)) index += 1;
      if (isValidIndex(index)) return casesName[index];
      return prevCase;
    });
  };

  const onCanvasReady = () => {
    setCanvasReady(true);
  };

  useEffect(() => {
    // init canvas
    const canvas = new Canvas({
      container: containerRef.current!,
      width: 1000,
      height: 1000,
      renderer: getRenderer(),
    });
    canvasRef.current = canvas;

    connectToPlugins(canvas);

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener(CanvasEvent.READY, onCanvasReady);

    return () => {
      canvas.removeEventListener(CanvasEvent.READY, onCanvasReady);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rendererToSelect = renderer || 'svg';
    if (!canvas) return;
    setSearch({ renderer: rendererToSelect });
    canvas.setRenderer(getRenderer());
  }, [renderer]);

  useEffect(() => {
    if (!canvasReady) return;
    const caseToShow = currCase || caseList[0];
    setSearch({ case: caseToShow });
    renderCase(caseToShow);
  }, [currCase, canvasReady]);

  return (
    <div>
      <Select onSelect={setCurrCase} onSearch={searchCase} value={currCase} style={{ width: 200 }} showSearch>
        {caseList.map((name) => (
          <Option key={name}>{name}</Option>
        ))}
      </Select>
      <Select value={renderer} onSelect={setRenderer} style={{ width: 140, margin: 10 }}>
        <Option value="svg">svg</Option>
        <Option value="canvas">canvas</Option>
      </Select>
      <span>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </span>
      <div ref={containerRef}></div>
    </div>
  );
};

ReactDOM.render(<View />, document.getElementById('root'));
