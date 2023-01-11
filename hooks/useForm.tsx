import { useState } from "react";

export default function useForm(values: string) {
  const [from, setForm] = useState(string);

  const onChangeHandler = (e: Event) => {
    setForm((prev) => {
      if (e.target.name !== null && e.target.value !== null) {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      }
    });
  };

  return <div>useForm</div>;
}
