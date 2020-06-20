import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import defaultAxios from 'axios';

const useAxios = (opts, axiosInstance = defaultAxios) => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  const [trigger, setTrigger] = useState(0);

  const refetch = () => {
    setState({ ...state, loading: true });
    setTrigger(Date.now());
  };

  useEffect(() => {
    if (!opts.url) {
      return;
    }
    axiosInstance(opts)
      .then((data) => {
        setState({ ...state, loading: false, data });
      })
      .catch((error) => {
        setState({ ...state, loading: false, error });
      });
  }, [trigger]);
  return { ...state, refetch };
};

const App = () => {
  const { loading, error, data, refetch } = useAxios({
    url: 'https://yts.am/api/v2/list_movies.json',
  });
  console.log(`${loading}\n${JSON.stringify(data)}\n${error}\n`);
  return (
    <div className="App">
      <h1>{data && data.status}</h1>
      <h2>{loading && 'loading'}</h2>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};

export default App;
