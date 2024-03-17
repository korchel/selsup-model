import React from 'react';
import ReactDOM from 'react-dom/client';

interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'array'; 
}

interface ParamValue {
  paramId: number;
  value: string | number | Array<string | number>;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

class ModelEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: props.model.paramValues,
    };
  }

  getModel() {
    return this.state.paramValues;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: number, type: string) => {
    let newValue: unknown = event.target.value;
    if (type === 'number') {
      newValue = Number(event.target.value) || '';
    }
    if (type === 'array') {
      newValue = [...event.target.value.split(/\s+|,\s+/)];
    }
    const paramValues = this.state.paramValues;
    const currentParam = paramValues.find((param) => param.paramId === id);
    if (!currentParam) {
      this.setState({ paramValues: [...paramValues, { paramId: id, value: newValue as string | number | Array<number | string> }] });
    } else {
      const newParamValues = paramValues.map((value) => value.paramId === id ? { ...value, value: newValue as string | number | Array<number | string> } : value)
      this.setState({ paramValues: newParamValues });
    }
  }

  render() {
    const requiredParams = this.props.params;
    const paramValues = this.state.paramValues;
    return (
      <div style={{ width: '400px' } }>
        {requiredParams.map(requiredParam => {
          let value = paramValues.find((paramValue) => paramValue.paramId === requiredParam.id)?.value || '';
          return (
            <div key={requiredParam.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor={`${requiredParam.id}`}>{requiredParam.name + ':'}</label>
              <input
                id={`${requiredParam.id}`}
                type="text"
                value={Array.isArray(value) ? value.join(' ') : `${value}`}
                onChange={(event) => this.handleChange(event, requiredParam.id, requiredParam.type)}
                autoComplete='off'
              />
            </div>
          )
        })}
      </div>
    );
  }
}

const dummyParams: Param[] = [
  {
    id: 1,
    name: 'назначение',
    type: 'string'
  },
  {
    id: 2,
    name: 'длина',
    type: 'string'
  },
  {
    id: 3,
    name: 'размер',
    type: 'number',
  },
  {
    id: 4,
    name: 'цвета',
    type: 'array',
  },
];

const dummyModel = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
};

const App = () => {
  const ref = React.createRef<ModelEditor>();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <ModelEditor model={dummyModel} params={dummyParams} ref={ref} />
      <button onClick={() => console.log(ref.current?.getModel())}>getModel</button>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
