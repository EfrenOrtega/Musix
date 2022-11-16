
export default function Input({ placeholder, type, name, handleChange, value }) {
  return (

    (handleChange) ?
      <input
        onChange={(e) => handleChange(e)}
        type={type}
        placeholder={placeholder}
        name={name}
        required
        value={value}
      />
      :
      <input type={type} placeholder={placeholder} required />

  )
}