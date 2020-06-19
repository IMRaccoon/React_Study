export const useInput = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const onChange = ({ target }) => {
    let willUpdate = true;
    if (typeof validator === 'function') {
      willUpdate = validator(target.value);
    }
    if (willUpdate) {
      setValue(target.value);
    }
  };
  return { value, onChange };
};
